from treys import Deck, Evaluator
evaluator = Evaluator()
deck = Deck()

players = 5
board = deck.draw(5)
player_hands = [deck.draw(2) for i in range(players)]

player_scores = [evaluator.evaluate(board, player_hands[i]) for i in range(players)]

print(player_scores)

evaluator.hand_summary(board, player_hands)