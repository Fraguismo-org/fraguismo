import os
from web3 import Web3
from dotenv import load_dotenv

class TokenService:
    def __init__(self):
        self.rpc_url = os.getenv("RPC_URL")
        self.private_key = os.getenv("PRIVATE_KEY")
        self.proposta_contract_address = os.getenv("PROPOSTA_CONTRACT_ADDRESS")
        self.proposta_abi = [...]
        
    async def abrir_votacao(self):
        try:
            tx_hash = await write
        except Exception as e:
            print(f"Erro ao abrir votação: {e}")
    
    async def clear_presence(self):
        pass

    async def kill_contract(self):
        pass

    async def get_block_until_voting_ends(self):
        pass
    
    async def register_presence(self):
        pass

    async def make_propose(self):
        pass

    async def do_vote(self):
        pass

    async def end_voting(self):
        pass

    async def buy_tokens(self):
        pass

    async def withdraw(self):
        pass
    
    async def get_proposal_details(self):
        pass

    async def list_open_proposals(self):
        pass
    
    async def preencher(self, hash):
        pass
