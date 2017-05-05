import updateFunc from './update/update'
import createFunc from './create/create'
//import Phaser from '../phaser/phaser'

let d = {}
export default d

// obj for storing local player name
export const localState = {player: null}

const gameFunc = function() {

  
  // game play area is a box so walls of 192 width on each side
  d.game = new Phaser.Game(1024, 640, Phaser.AUTO, '', { preload, create, update });
  d.game.antialias = false

  function init() {
  }

  function preload() {
    d.game.load.image('raj', 'sprites/raj.png')
    d.game.load.spritesheet('roboraj', 'sprites/roboraj.png', 32, 32)
    d.game.load.spritesheet('fatKid', 'sprites/fat-kid.png', 20, 32)
    d.game.load.image('arrow', 'sprites/Arrow.png')
    d.game.load.image('bow', 'sprites/bow-crop.png')
    d.game.load.image('ground', 'sprites/platform.png')
    d.game.load.image('brick', 'sprites/brick.png')
    d.game.load.image('grassBlock', 'sprites/grass_2x1.png')
    d.game.load.image('background', 'sprites/background.png')
    d.game.load.image('grassBlockLedge', 'sprites/grass_4x1.png')
    d.game.load.image('dirt', 'sprites/dirt.png')
  }

  function create() {
    createFunc(d)

  }



  function update() {
    updateFunc(d)
  }

  return {}
}()
