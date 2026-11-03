import type React from 'react';

import level01Sun from './level-01-sun';
import level02Face from './level-02-face';
import level03Cloud from './level-03-cloud';
import extra01StickFigure from './extra-01-stick-figure';
import level0201House from './level-02-01-house';
import level0202Apple from './level-02-02-apple';
import level0203Rocket from './level-02-03-rocket';
import level0204Balloon from './level-02-04-balloon';
import level0501Lion from './level-05-01-lion';
import level0502Landscape from './level-05-02-landscape';
import level0503Castle from './level-05-03-castle';
import level06Dog from './level-06-dog';
import level07Cat from './level-07-cat';
import level08Sheep from './level-08-sheep';
import extra03Flower from './extra-03-flower';
import extra04Bird from './extra-04-bird';
import level04House from './level-04-house';
import level05Tree from './level-05-tree';
import extra02Car from './extra-02-car';
import level09Fish from './level-09-fish';
import level10Butterfly from './level-10-butterfly';
import level11CatSimple from './level-11-cat-simple';
import level12DogSimple from './level-12-dog-simple';
import level13BirdSimple from './level-13-bird-simple';
import level14CarV2 from './level-14-car-v2';
import level15Train from './level-15-train';
import level16Bicycle from './level-16-bicycle';
import level17TreeDetailed from './level-17-tree-detailed';
import level18FlowerDetailed from './level-18-flower-detailed';
import level19FishTropical from './level-19-fish-tropical';
import level20HouseDetailed from './level-20-house-detailed';
import tiere01Frog from './tiere-01-frog';
import tiere02Rabbit from './tiere-02-rabbit';
import tiere03Duck from './tiere-03-duck';
import tiere04Owl from './tiere-04-owl';
import tiere05Bear from './tiere-05-bear';
import tiere06Penguin from './tiere-06-penguin';
import tiere07Snail from './tiere-07-snail';
import tiere08Horse from './tiere-08-horse';
import tiere09Elephant from './tiere-09-elephant';
import tiere10Fox from './tiere-10-fox';
import fahrzeuge01Bus from './fahrzeuge-01-bus';
import fahrzeuge02Airplane from './fahrzeuge-02-airplane';
import fahrzeuge03Sailboat from './fahrzeuge-03-sailboat';
import fahrzeuge04Tractor from './fahrzeuge-04-tractor';
import fahrzeuge05Helicopter from './fahrzeuge-05-helicopter';
import fahrzeuge06Firetruck from './fahrzeuge-06-firetruck';
import fahrzeuge07Ambulance from './fahrzeuge-07-ambulance';
import fahrzeuge08Submarine from './fahrzeuge-08-submarine';
import fahrzeuge09Speedboat from './fahrzeuge-09-speedboat';
import fahrzeuge10Spaceshuttle from './fahrzeuge-10-spaceshuttle';
import natur01Rainbow from './natur-01-rainbow';
import natur02Mushroom from './natur-02-mushroom';
import natur03Seashell from './natur-03-seashell';
import natur04Cactus from './natur-04-cactus';
import natur05Bee from './natur-05-bee';
import natur06Ladybug from './natur-06-ladybug';
import natur07Snowflake from './natur-07-snowflake';
import natur08Palmtree from './natur-08-palmtree';
import natur09Waterfall from './natur-09-waterfall';
import natur10Volcano from './natur-10-volcano';
import maerchen01Crown from './maerchen-01-crown';
import maerchen02Wand from './maerchen-02-wand';
import maerchen03Wizardhat from './maerchen-03-wizardhat';
import maerchen04Fairy from './maerchen-04-fairy';
import maerchen05Frogprince from './maerchen-05-frogprince';
import maerchen06Pumpkincarriage from './maerchen-06-pumpkincarriage';
import maerchen07Spellbook from './maerchen-07-spellbook';
import maerchen08Unicorn from './maerchen-08-unicorn';
import maerchen09Dragon from './maerchen-09-dragon';
import maerchen10Castletower from './maerchen-10-castletower';
import essen01Popsicle from './essen-01-popsicle';
import essen02Cookie from './essen-02-cookie';
import essen03Strawberry from './essen-03-strawberry';
import essen04Pizza from './essen-04-pizza';
import essen05Cupcake from './essen-05-cupcake';
import essen06Banana from './essen-06-banana';
import essen07Carrot from './essen-07-carrot';
import essen08Cake from './essen-08-cake';
import essen09Hamburger from './essen-09-hamburger';
import essen10Watermelon from './essen-10-watermelon';

export const LEVEL_IMAGE_RENDERERS: Record<
  string,
  (svgSize: number, viewBox: string) => React.ReactElement
> = {
  'level-01-sun.svg': level01Sun,
  'level-02-face.svg': level02Face,
  'level-03-cloud.svg': level03Cloud,
  'extra-01-stick-figure.svg': extra01StickFigure,
  'level-02-01-house.svg': level0201House,
  'level-02-02-apple.svg': level0202Apple,
  'level-02-03-rocket.svg': level0203Rocket,
  'level-02-04-balloon.svg': level0204Balloon,
  'level-05-01-lion.svg': level0501Lion,
  'level-05-02-landscape.svg': level0502Landscape,
  'level-05-03-castle.svg': level0503Castle,
  'level-06-dog.svg': level06Dog,
  'level-07-cat.svg': level07Cat,
  'level-08-sheep.svg': level08Sheep,
  'extra-03-flower.svg': extra03Flower,
  'extra-04-bird.svg': extra04Bird,
  'level-04-house.svg': level04House,
  'level-05-tree.svg': level05Tree,
  'extra-02-car.svg': extra02Car,
  'level-09-fish.svg': level09Fish,
  'level-10-butterfly.svg': level10Butterfly,
  'level-11-cat-simple.svg': level11CatSimple,
  'level-12-dog-simple.svg': level12DogSimple,
  'level-13-bird-simple.svg': level13BirdSimple,
  'level-14-car-v2.svg': level14CarV2,
  'level-15-train.svg': level15Train,
  'level-16-bicycle.svg': level16Bicycle,
  'level-17-tree-detailed.svg': level17TreeDetailed,
  'level-18-flower-detailed.svg': level18FlowerDetailed,
  'level-19-fish-tropical.svg': level19FishTropical,
  'level-20-house-detailed.svg': level20HouseDetailed,
  'tiere-01-frog.svg': tiere01Frog,
  'tiere-02-rabbit.svg': tiere02Rabbit,
  'tiere-03-duck.svg': tiere03Duck,
  'tiere-04-owl.svg': tiere04Owl,
  'tiere-05-bear.svg': tiere05Bear,
  'tiere-06-penguin.svg': tiere06Penguin,
  'tiere-07-snail.svg': tiere07Snail,
  'tiere-08-horse.svg': tiere08Horse,
  'tiere-09-elephant.svg': tiere09Elephant,
  'tiere-10-fox.svg': tiere10Fox,
  'fahrzeuge-01-bus.svg': fahrzeuge01Bus,
  'fahrzeuge-02-airplane.svg': fahrzeuge02Airplane,
  'fahrzeuge-03-sailboat.svg': fahrzeuge03Sailboat,
  'fahrzeuge-04-tractor.svg': fahrzeuge04Tractor,
  'fahrzeuge-05-helicopter.svg': fahrzeuge05Helicopter,
  'fahrzeuge-06-firetruck.svg': fahrzeuge06Firetruck,
  'fahrzeuge-07-ambulance.svg': fahrzeuge07Ambulance,
  'fahrzeuge-08-submarine.svg': fahrzeuge08Submarine,
  'fahrzeuge-09-speedboat.svg': fahrzeuge09Speedboat,
  'fahrzeuge-10-spaceshuttle.svg': fahrzeuge10Spaceshuttle,
  'natur-01-rainbow.svg': natur01Rainbow,
  'natur-02-mushroom.svg': natur02Mushroom,
  'natur-03-seashell.svg': natur03Seashell,
  'natur-04-cactus.svg': natur04Cactus,
  'natur-05-bee.svg': natur05Bee,
  'natur-06-ladybug.svg': natur06Ladybug,
  'natur-07-snowflake.svg': natur07Snowflake,
  'natur-08-palmtree.svg': natur08Palmtree,
  'natur-09-waterfall.svg': natur09Waterfall,
  'natur-10-volcano.svg': natur10Volcano,
  'maerchen-01-crown.svg': maerchen01Crown,
  'maerchen-02-wand.svg': maerchen02Wand,
  'maerchen-03-wizardhat.svg': maerchen03Wizardhat,
  'maerchen-04-fairy.svg': maerchen04Fairy,
  'maerchen-05-frogprince.svg': maerchen05Frogprince,
  'maerchen-06-pumpkincarriage.svg': maerchen06Pumpkincarriage,
  'maerchen-07-spellbook.svg': maerchen07Spellbook,
  'maerchen-08-unicorn.svg': maerchen08Unicorn,
  'maerchen-09-dragon.svg': maerchen09Dragon,
  'maerchen-10-castletower.svg': maerchen10Castletower,
  'essen-01-popsicle.svg': essen01Popsicle,
  'essen-02-cookie.svg': essen02Cookie,
  'essen-03-strawberry.svg': essen03Strawberry,
  'essen-04-pizza.svg': essen04Pizza,
  'essen-05-cupcake.svg': essen05Cupcake,
  'essen-06-banana.svg': essen06Banana,
  'essen-07-carrot.svg': essen07Carrot,
  'essen-08-cake.svg': essen08Cake,
  'essen-09-hamburger.svg': essen09Hamburger,
  'essen-10-watermelon.svg': essen10Watermelon,
};
