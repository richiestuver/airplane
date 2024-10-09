# Instructions
## Run on Web:
Navigate to (https://airplane.richiestuver.com/) or [alt link](https://airplane-ahv.pages.dev/)

Run Locally:
`git clone` this repository and `cd` into it. Then Run:

```
cd airplane
npm install
npm run preview
```

## Controls: 
- Speed (Knots): Up / Down Arrow Keys
- Yaw (Degrees): Left / Right Arrow Keys

## Trajectory
The trajectory visualization is tied to the airplane's bearing. When the plane is 
positioned at center of the screen, say (0,0), with a 0 degree yaw, the line extends
from the nose of the airplane to the edge of the screen at (0, screen_edge). The idea is
to maintain this relative positioning at all times, such that when the airplane translates to another
coordinate and angle of rotation, one could redefine the coordinate space such that the airplane
is again centered at the origin (0,0) with a 0 degree and find that the trajectory again
preserves the vector that begins at (0,0) and ends at (0, screen_edge). 

This is accomplished by attaching the trajectory line to the local coordinate space by making 
the trajectory line a child object of the airplane sprite in the render scene, so that each update
of the render loop re-determines the trajectory path according to the change in the airplane's (x,y) 
coordinate and rotation. 
