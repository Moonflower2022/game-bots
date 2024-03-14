from pyautogui import *
import pyautogui
import time
import keyboard
import numpy
import random
from pynput.mouse import Button, Controller

mouse = Controller()
running = False
firstRun = True

# pretty scuffed, link: http://tanksw.com/piano-tiles/

# for in game action use these integrated functions that simulate human behaviour
# otherwise, use original functions


def click(x, y):
    mouse.position = (x, y)
    mouse.click(Button.left, 1)

# loop


blockSize = {"x": 125, "y": 190}
yOffSet = 50
# starting from the right and going left

while True:
    while running:
        # to set the
        if firstRun:
            mouse.scroll(0, 10)
            mouse.scroll(0, -1)
            firstRun = False
        for i in range(4):
            if pyautogui.pixel(1138 - blockSize["x"] * i, 689) == (17, 17, 17) and pyautogui.pixel(1138 - blockSize["x"] * i, 689 - 45) != (255, 255, 255):
                click(1138 - blockSize["x"] * i, 689)
                break
        # if pyautogui.pixel(1178, 166) == (12, 12, 12) or pyautogui.pixel(1178, 166) == (178, 178, 178):
            # pyautogui.click(882, 601)
        if keyboard.is_pressed("ctrl"):
            running = False
    if keyboard.is_pressed("shift"):
        running = True
    if keyboard.is_pressed("alt"):
        break
