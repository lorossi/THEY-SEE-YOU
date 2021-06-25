# THEY SEE YOU

## Try it here [lorenzoros.si/THEY-SEE-YOU](https://lorenzoros.si/THEY-SEE-YOU/)

## Background

This week's *"unhealthy weekly obsession"* is googly eyes. I like the way they convert anything (for me, at least) into something stupid and hilarious. I go around with at least a bag of them in my pockets, ready to be stuck to any surface unlucky enough to be in the wrong place (near me) at the wrong time (when I'm near them). I even bought a 700 pack of googly eyes from AliExpress (although I'm still waiting the delivery, but that's not surprising).

Sadly, I cannot stick them on the internet (so far), but I to place as many of them as I could inside a web and make them follow my mouse around. I quickly got that working but it was missing... something.
It was cool, don't get me wrong, but plain and boring. All these eyes in a grid, just looking at your mouse. It wasn't anything special.

I started playing around with it, in order to make it more interesting to look and feel. I then quickly realized that this would work way better if everything was less goofy and way more creepy.
First I began by placing them in random spots inside the page using a "circle packing" algorithm. Basically, circles are placed one by one at randomly picked coordinates in the page and their size is increased by fixed amounts until they touch another circle. This algorithm is called "circle packing". By having uneven sized circles, the eyes started being less ordered and more creepy (sorry, trypophobic people trying this).

The next thing I started to toy with was colours. The eyes now have a random, slightly unique, hue. Then I made them open and close their lids according to their size and the distance to the mouse.

Now that's what we are talking about! After a few very small adjustments, I decided that I was happy with it and it was ready to be published. Of course I have then waited a few months because... because... call it anxiety, call it *"I can't be bothered"* but I basically procrastinated until I forgot the whole project. Luckily I write everything down.

In the end, I tried to give this whole project a vague aura of creepiness and unease. Imagine this sketch being drawn on a bigger screen! It would really creep me out.

As I always do with my interactive projects, I publish the link and a few pre-rendered (albeit in low-quality) videos on this page, as well as in my [Instagram profile](https://instagram.com/lorossi97). Follow me to view my work and see what I like to do!

## Technical stuff

The whole animation is rendered in a surprisingly smooth way on a JS canvas. The eyes are placed before everything else is drawn using a circle packing algorithm. It takes way less than I was anticipating, as it takes only a few milliseconds to find space for all the eyes.

As I have done many times before, I have developed everything using my extremely simple canvas boilerplate that I am slowly creating to satisfy my own needs. Of course it's missing a lot of stuff (like a basic documentation *coff coff*) but I created it with the objective of being extremely light to load and fast to use.

I will write some documentation, eventually. Maybe. *Probably.*

## Output

![render-1](output/output-1/output.gif)
![render-2](output/output-2/output.gif)
![render-3](output/output-3/output.gif)
![render-4](output/output-4/output.gif)

## Credits

This project is distributed under Attribution 4.0 International (CC BY 4.0) license.
