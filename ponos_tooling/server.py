from computational_metrics import *
from levels.dungeongrams.dungeongrams import percent_playable, FLAW_NO_FLAW

from json import loads, dumps
import socket
import os
import traceback
import sys

def server(host='localhost', port=8080):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind((host, port))
            s.listen(1)
            print(f"Server listening on {host}:{port}")

            while True:
                conn, addr = s.accept()
                print(f"Connected by {addr}")

                with conn:
                    while True:
                        cmd = conn.recv(1024)
                        if not cmd:
                            break

                        if cmd == b"config":
                            with open('config.json', 'r') as f:
                                conn.sendall(bytes(f.read(), 'utf-8'))
                        elif cmd == b'levels':
                            lvls = []

                            # levels made for previous work
                            for file_name in os.listdir(os.path.join('levels', "dungeongrams", "train")):
                                with open(os.path.join('levels', file_name), 'r') as f:
                                    lvls.append(f.readlines())

                            for file_name in os.listdir(os.path.join('levels', "dungeongrams", "other_training_levels")):
                                with open(os.path.join('levels', file_name), 'r') as f:
                                    lvls.append(f.readlines())

                            # levels from handcrafted progression
                            for file_name in os.listdir(os.path.join('levels', "segments")):
                                with open(os.path.join('levels', file_name), 'r') as f:
                                    lvls.append(f.readlines())

                            conn.sendall((dumps(lvls)+'EOF').encode())
                        elif cmd[:6] == b'assess':
                            lvl = loads(cmd[6:].decode('utf-8'))
                            return_data = {
                                'completability': percent_playable(lvl, False, True, True, FLAW_NO_FLAW),
                                'linearity': 0,
                                'leniency': 0,
                            }

                            conn.sendall(dumps(return_data).encode('utf-8'))
                        elif cmd[:6] == b'reward':
                            lvl = loads(cmd[6:].decode('utf-8'))
                            return_data = {'reward': percent_leniency(lvl) }

                            conn.sendall(dumps(return_data).encode('utf-8'))
                        else:
                            print(f'Unrecognized command: {cmd}')
                            error_message = bytes(f'Unrecognized command: {cmd}', 'utf-8')
                            conn.sendall(error_message)
        except Exception as e:
            print(f"An error occurred: {e}")
            traceback.print_exc(file=sys.stdout)
            s.close()

if __name__ == "__main__":
    server()