import d from '../game'

export default function createArrow(player, arrowType) {

  // Create each arrow if player.numArrows > 0
  let currPlayer = d.currentPlayer

  if (arrowType === 'regular') {
    let offset = (d[player].bow.rotation === -1.57) ? 32 : 0
    let arrow  = d.game.add.sprite(d[player].x, d[player].y + offset, 'arrow')
    arrow.scale.set(1.5, 1.5)
    if (d[player].bow.rotation === -.785) offset += 32

    // Set its pivot point to the center of the arrow
    arrow.anchor.setTo(0.5, 0.5)

    // Enable physics on the arrow
    d.game.physics.arcade.enable(arrow)
    arrow.body.gravity.y = 1500

    // arrows take ~4 frames to 'arm' if you aim downwards so they collide with the shooter less often
    arrow.deploy = false
    d.game.time.events.add(offset * 2 + 3, function(){
      this.deploy = true
    }, arrow)

    arrow.checkWorldBounds = true

    arrow.type = 'regular'

    d.arrowsArray.push(arrow);

    d.arrow = arrow
  } else {
    let arrow  = d.game.add.sprite(d[player].x, d[player].y, 'arrow')

    arrow.scale.set(2, 2)

    // Set its pivot point to the center of the arrow
    arrow.anchor.setTo(0.5, 0.5)

    // Enable physics on the arrow
    d.game.physics.arcade.enable(arrow)

    arrow.checkWorldBounds = true

    arrow.body.bounce.set(1.2)

    arrow.type = 'bouncyArrow'

    arrow.lifespan = 2000

    d.arrowsArray.push(arrow);

    d.arrow = arrow
  }

}
