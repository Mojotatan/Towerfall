import Client from '../client'
import createPlayer from './player'
import fireArrow from '../update/fireArrow'
import d from '../game'
import {shade} from '../util'
import createTreasureChest from './createTreasureChest'
import {removeArrowDisplay} from '../update/arrowDisplay'

export default function createFunc() {
  // important for the kill cam
  d.go = true

  // set the current round to avoid double scoring
  d.round = d.myGame.round

  let currPlayer

  //checking for current player
  if (d.currentPlayer) {
        currPlayer = d.currentPlayer
    }

  // draw style rectangles
  let fill1 = d.myGame.player1 ? 0x000088 : 0x373737
  shade(0, 0, 192, 320, fill1)

  let fill2 = d.myGame.player2 ? 0x880000 : 0x373737
  shade(832, 0, 192, 320, fill2)

  let fill3 = d.myGame.player3 ? 0x008800 : 0x373737
  shade(0, 320, 192, 320, fill3)

  let fill4 = d.myGame.player4 ? 0xbbbb00 : 0x373737
  shade(832, 320, 192, 320, fill4)

  //parse map data
  let map = d.map

  //add stage background
  d.background = d.game.add.image(192, 0, map.background.file)
  d.background.scale.set(map.background.scale, map.background.scale)

  //  We're going to be using physics, so enable the Arcade Physics system
  d.game.physics.startSystem(Phaser.Physics.ARCADE)
  //set platforms
  d.platforms = d.game.add.group()
  //enable physics on platforms
  d.platforms.enableBody = true
  d.platforms.physicsBodyType = Phaser.Physics.ARCADE

  // the shield wall tiles should be impassible to arrows but passible to players
  // CURRENTLY NOT IMPLEMENTED -- WILL DO LATER IF DEEMED IMPORTANT ENOUGH
  d.shields = d.game.add.group()
  d.shields.enableBody = true
  d.shields.physicsBodyType = Phaser.Physics.ARCADE

  // the spike tiles should kill players upon collision
  d.spikes = d.game.add.group()
  d.spikes.enableBody = true
  d.spikes.physicsBodyType = Phaser.Physics.ARCADE

  // add blocks
  map.blocks.forEach(block => {
    let newBlock = d.platforms.create(block.x, block.y, block.tile)
    newBlock.body.immovable = true
  })

  // add shields to map (NOT IMPLEMENTED)
  map.shields.forEach(shield => {
    let newShield = d.shields.create(shield.x, shield.y, 'shieldWall')
    newShield.body.immovable = true
    newShield.rotation = shield.rotation
  })

  // add spikes to map
  map.spikes.forEach(spike => {
    let newSpike = d.spikes.create(spike.x, spike.y, spike.tile)
    newSpike.body.immovable = true
  })

  // create players
  let players = ['player1', 'player2', 'player3', 'player4']
  d.players = players.filter(player => {
    return d.myGame[player]
  })

  let playerCount = d.players.length

  let starts = [map.p1Start, map.p2Start]
  if (playerCount > 2) {
    starts.push(map.p3Start)
    starts.push(map.p4Start)
  }

  function rStart () {
    let rng = Math.floor(d.rng.pop() * starts.length)
    return starts.splice(rng, 1)[0]
  }

  d.players.forEach(player => {
    createPlayer(d.myGame.chars[player.slice(-1)], player, rStart())
  })

  if (d.myGame.player1) {
    let name1 = d.myGame.alias[1] || 'Player One'
    d.game.add.text(16, 0, name1, {font: '20pt ArcadeClassic', fill: '#FFFFFF'})
    let avatar1 = d.game.add.image(6, 176, d.myGame.chars[1])
    avatar1.frame = 2
    avatar1.crop(new Phaser.Rectangle(0, 0, 20, 16))
    avatar1.scale.set(9, 9)
    d.game.add.text(80, 112, d.myGame.score[1], {font: '48pt ArcadeClassic', fill: '#FFFFFF'})
  }

  if (d.myGame.player2) {
    let name2 = d.myGame.alias[2] || 'Player Two'
    d.game.add.text(848, 0, name2, {font: '20pt ArcadeClassic', fill: '#FFFFFF'})
    let avatar2 = d.game.add.image(838, 176, d.myGame.chars[2])
    avatar2.frame = 2
    avatar2.crop(new Phaser.Rectangle(0, 0, 20, 16))
    avatar2.scale.set(9, 9)
    d.game.add.text(912, 112, d.myGame.score[2], {font: '48pt ArcadeClassic', fill: '#FFFFFF'})
  }

  if (d.myGame.player3) {
    let name3 = d.myGame.alias[3] || 'Player Three'
    d.game.add.text(16, 320, name3, {font: '20pt ArcadeClassic', fill: '#FFFFFF'})
    let avatar3 = d.game.add.image(6, 176 + 320, d.myGame.chars[3])
    avatar3.frame = 2
    avatar3.crop(new Phaser.Rectangle(0, 0, 20, 16))
    avatar3.scale.set(9, 9)
    d.game.add.text(80, 112 + 320, d.myGame.score[3], {font: '48pt ArcadeClassic', fill: '#FFFFFF'})
  }

  if (d.myGame.player4) {
    let name4 = d.myGame.alias[4] || 'Player Four'
    d.game.add.text(848, 320, name4, {font: '20pt ArcadeClassic', fill: '#FFFFFF'})
    let avatar4 = d.game.add.image(838, 176 + 320, d.myGame.chars[4])
    avatar4.frame = 2
    avatar4.crop(new Phaser.Rectangle(0, 0, 20, 16))
    avatar4.scale.set(9, 9)
    d.game.add.text(912, 112 + 320, d.myGame.score[4], {font: '48pt ArcadeClassic', fill: '#FFFFFF'})
  }

  d[currPlayer].shotDirection = {left: false, right: false, up: false, down: false}
  // arrow and shooting
  d.spaceBar = d.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)
  d.game.input.keyboard.addKeyCapture(Phaser.KeyCode.SPACEBAR)
  d.spaceBar.onDown.add(() => {
    fireArrow(false, null, d[currPlayer].shotDirection)
    removeArrowDisplay(currPlayer)
  })

  d.arrowsArray = []

  d.players.forEach(player => {
    d[player].treasure = {}
    d[player].nextArrowType = 'regular'
  })

  d.treasure = null
  d.game.time.events.add(4000, function() {createTreasureChest(map.treasureSpawn.x, map.treasureSpawn.y)})

}
