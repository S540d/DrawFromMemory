/**
 * Tests für confirmDestructive (platform.ts): window.confirm im Web, Alert.alert nativ.
 * `isWeb` ist beim Import fest, daher wird das Modul pro Plattform isoliert geladen.
 */

describe('confirmDestructive', () => {
  const options = (onConfirm: () => void) => ({
    title: 'Titel',
    message: 'Wirklich löschen?',
    confirmLabel: 'Ja',
    cancelLabel: 'Abbrechen',
    onConfirm,
  });

  describe('web', () => {
    const load = () => {
      let mod: typeof import('./platform');
      jest.isolateModules(() => {
        jest.doMock('react-native', () => ({
          Platform: { OS: 'web' },
          Alert: { alert: jest.fn() },
        }));
        mod = require('./platform');
      });
      return mod!;
    };

    afterEach(() => jest.restoreAllMocks());

    it('ruft onConfirm, wenn window.confirm bestätigt wird', () => {
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true); // platform-safe
      const onConfirm = jest.fn();
      load().confirmDestructive(options(onConfirm));
      expect(confirmSpy).toHaveBeenCalledWith('Wirklich löschen?');
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('ruft onConfirm nicht, wenn abgebrochen wird', () => {
      jest.spyOn(window, 'confirm').mockReturnValue(false); // platform-safe
      const onConfirm = jest.fn();
      load().confirmDestructive(options(onConfirm));
      expect(onConfirm).not.toHaveBeenCalled();
    });
  });

  describe('native', () => {
    const load = () => {
      const alert = jest.fn();
      let mod: typeof import('./platform');
      jest.isolateModules(() => {
        jest.doMock('react-native', () => ({ Platform: { OS: 'android' }, Alert: { alert } }));
        mod = require('./platform');
      });
      return { mod: mod!, alert };
    };

    it('zeigt Alert.alert mit Abbrechen- und destruktivem Bestätigen-Button', () => {
      const { mod, alert } = load();
      const onConfirm = jest.fn();
      mod.confirmDestructive(options(onConfirm));

      expect(alert).toHaveBeenCalledTimes(1);
      const [title, message, buttons] = alert.mock.calls[0];
      expect(title).toBe('Titel');
      expect(message).toBe('Wirklich löschen?');
      expect(buttons).toEqual([
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Ja', style: 'destructive', onPress: onConfirm },
      ]);
      // onConfirm läuft erst beim Tippen auf den Bestätigen-Button
      expect(onConfirm).not.toHaveBeenCalled();
      buttons[1].onPress();
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });
});
