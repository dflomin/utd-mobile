# Fixed-Point Gameplay Math

Use hybrid math:
- fixed-point/integer for gameplay-critical values
- floats only for visuals/rendering

Gameplay-critical:
- HP
- damage
- gold
- mana
- cooldowns
- speeds
- path progress
- RNG-derived values
- status durations

Phaser can interpolate using floats.
