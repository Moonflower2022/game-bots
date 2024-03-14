from bs4 import BeautifulSoup
import requests
from selenium import webdriver
import time
import re
import keyboard
import pyautogui
import numpy
from pynput.mouse import Button, Controller

mouse = Controller()


deck_cards = []
deck_cards_pos = []
driver = webdriver.Chrome()
running = True

# link for website: https://setwithfriends.com/

# idk why but the number
# after jss changes sometimes so just call html.prettify() to find it
jss_num = 39
# this one is the number in all the svg classes that draw the symbols

# take url from "Inviting Friends
# To invite someone to play, share this URL:"

url = "https://setwithfriends.com/room/silent-bashful-table-2"

# selenium (works, just a bit slow)

driver.get(url)
time.sleep(3)
driver.maximize_window()

# get all the stuff we need


def update_info():
    global deck_cards
    global deck_cards_pos
    global html
    deck_cards = []
    deck_cards_pos = []
    page_source = driver.page_source
    html = BeautifulSoup(page_source, "html.parser")
    cards_text = html.find_all(
        "div", ["class", "jss"+str(jss_num+1) + " jss" + str(jss_num+2)])

    for card_text in cards_text:
        card_info = str(card_text.parent)
        pos_text = ""
        i = card_info.find("translate(") + 10
        while card_info[i] != ")":
            if card_info[i] != "p" and card_info[i] != "x":
                pos_text = pos_text + card_info[i]
            i = i + 1
        deck_cards_pos.append(list(pos_text.split(", ")))
        card = ""
        # this thing too
        card = card + str(card_info.count("jss"+str(jss_num)) - 1)
        shape_text = ""
        o = card_info.find('href="#') + 7
        while card_info[o] != '"':
            shape_text = shape_text + card_info[o]
            o = o + 1

        match shape_text:
            case "squiggle":
                shape_text = "0"
            case "diamond":
                shape_text = "1"
            case "oval":
                shape_text = "2"

        card = card + shape_text

        color_text = ""
        j = card_info.find('stroke="#') + 9
        while card_info[j] != '"':
            color_text = color_text + card_info[j]
            j = j + 1

        match color_text:
            case "ff0101":
                color_text = "0"
            case "008002":
                color_text = "1"
            case "800080":
                color_text = "2"

        card = card + color_text

        fill_text = ""
        k = card_info.find('fill="') + 6
        while card_info[k] != '"':
            fill_text = fill_text + card_info[k]
            k = k + 1

        if fill_text == "#ff0101" or fill_text == "#008002" or fill_text == "#800080":
            mask_text = ""
            m = card_info.find('mask="') + 6
            while card_info[m] != '"':
                mask_text = mask_text + card_info[m]
                m = m + 1
            if mask_text == "":
                fill_text = "0"
            elif mask_text == "url(#mask-stripe)":
                fill_text = "1"
        elif fill_text == "transparent":
            fill_text = "2"

        card = card + fill_text

        deck_cards.append(card)


# cards are objects with atr of 4 digit string
# and pos of x y pos


def move_to_then_click(x, y):
    pyautogui.moveTo(x, y)
    mouse.press(Button.left)
    time.sleep(numpy.random.random_sample()/100 + 0.02)
    mouse.release(Button.left)


def last_card(card1, card2):
    card3 = ""
    for i in range(4):
        sum = int(card1[i]) + int(card2[i])
        num3 = (3-(sum % 3)) % 3
        card3 = card3 + str(num3)
    return card3


def location_of_set(cards_arr, cards_pos_arr):
    cards_arr_copy = cards_arr.copy()
    for i in range(len(cards_arr)):
        for o in range(i + 1, len(cards_arr)):
            c = last_card(cards_arr[i], cards_arr[o])
            if c in cards_arr_copy:
                return [cards_pos_arr[i], cards_pos_arr[o], cards_pos_arr[cards_arr.index(c)]]

# expecting an input of a card


def card_to_desc(card):
    desc = ""
    desc = desc + str(int(card[0])+1) + " "
    match card[1]:
        case "0":
            desc = desc + "squiggle "
        case "1":
            desc = desc + "diamond "
        case "2":
            desc = desc + "oval "
    match card[2]:
        case "0":
            desc = desc + "red "
        case "1":
            desc = desc + "green "
        case "2":
            desc = desc + "purple "
    match card[3]:
        case "0":
            desc = desc + "whole "
        case "1":
            desc = desc + "striped "
        case "2":
            desc = desc + "empty "
    return desc

# expecting an input of an array with two strings for x and y

# def get_rand_pos(pos_arr):
#    match pos_arr:
#        case ['8', '8'] | :


# center_pos = [700, 430]

center_pos = [686, 263]

x_pos = [1101, 957]

random_margin = 5  # +- x and y

while running:
    if keyboard.is_pressed('ctrl'):
        update_info()
        info_arr = location_of_set(deck_cards, deck_cards_pos)
        for i in range(3):
            target_pos = [(float(info_arr[i][0])-8)*5/4 + 24 + center_pos[0],
                          (float(info_arr[i][1])-8)*4/3 + 8 + center_pos[1]]
            move_to_then_click(numpy.random.uniform(target_pos[0] - random_margin, target_pos[0] + random_margin), numpy.random.uniform(
                target_pos[1] - random_margin, target_pos[1] + random_margin))
        time.sleep(0.5)
        move_to_then_click(numpy.random.uniform(x_pos[0] - random_margin, x_pos[0] + random_margin),
                           numpy.random.uniform(x_pos[1] - random_margin, x_pos[1] + random_margin))
    if keyboard.is_pressed('alt'):
        update_info()
        print(html.prettify())

    if keyboard.is_pressed('shift'):
        running = False
driver.quit()
