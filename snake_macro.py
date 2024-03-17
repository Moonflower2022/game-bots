import time
import keyboard
import numpy
import random
from pynput.mouse import Button, Controller

mouse = Controller()
running = True

# for in game action use these integrated functions that simulate human behaviour
# otherwise, use original functions


def click(x, y):
    mouse.position = (x, y)
    mouse.press(Button.left)
    time.sleep(numpy.random.random_sample()/100 + 0.02)
    mouse.release(Button.left)

# left is n, right is m, pos number = scroll up, neg number = scroll down
# if both are present, first left then right


def scroll(n, m):
    if type(n) != "int" or type(m) != "int":
        running = False
        print("ERROR! use cmd f to find where this is.")
    else:
        for i in range(n):
            mouse.scroll(1, 0)
            time.sleep(numpy.random.uniform(0.05, 0.15))
        for o in range(m):
            mouse.scroll(0, 1)
            time.sleep(numpy.random.uniform(0.05, 0.15))

# loop

# normal: 17 x 15
# small: 10 x 9
#
def right_up():
    print("ran!@@@@")
    keyboard.press_and_release('right')
    keyboard.press_and_release('up')

def right_down():
    print("ran!")
    keyboard.press_and_release('right')
    keyboard.press_and_release('down')

keyboard.add_hotkey('delete', right_up) 
keyboard.add_hotkey('space', right_down)
keyboard.wait()
    
