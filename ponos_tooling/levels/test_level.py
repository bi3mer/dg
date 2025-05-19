from dungeongrams.dungeongrams import FLAW_NO_FLAW, percent_playable

playable = percent_playable("test_level.txt", True, True, True, FLAW_NO_FLAW)
print(f"Playable: {playable}")