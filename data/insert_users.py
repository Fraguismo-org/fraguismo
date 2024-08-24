import pandas as pd
from sqlalchemy import create_engine, select, MetaData, Table
import datetime
from models import AuthUser, MemberProfile, MemberUser, engine, session


class InsertDB:

    users = []
    member_users = []
    member_profiles = []
    engine = None
    df = None

    def __init__(self) -> None:        
        self.df = pd.read_excel('fraguismo.xlsx')
        self.format_auth_user()
        self.format_member_user()
        self.format_members_profile()
        self.fill_objects_list()

    def fill_objects_list(self):
        try:
            for _, row in self.df.iterrows():
                user =  AuthUser(
                    None,
                    first_name=row['first_name'], 
                    last_name=row['last_name'], 
                    email=row['email'], 
                    password=row['password'], 
                    is_superuser=False, 
                    username=row['username'], 
                    is_staff=False, 
                    is_active=True, 
                    date_joined=datetime.datetime.now())
                self.users.append(user)

                session.add(user)
                session.flush()
                
                profile = MemberProfile(
                    id=None,
                    nivel=row['nivel'],
                    observacao=row['observacao'],
                    pendencias=row['pendencias'],
                    pontuacao=row['pontuacao'],
                    squad=row['squad'],
                    user_id=user.id
                )
                self.member_profiles.append(profile)

                session.add(profile)
                session.flush()

                member_user = MemberUser(
                    aonde=row['aonde'],
                    birth=row['birth'],
                    bsc_wallet=row['bsc_wallet'],
                    city=row['city'],
                    como_conheceu=row['como_conheceu'],
                    fone=row['fone'],
                    instagram=row['instagram'],
                    job_title=row['job_title'],
                    quem_indicou=row['quem_indicou'],
                    user_ptr_id=user.id
                )
                self.member_users.append(member_user)
                session.add(member_user)
                session.flush()
            session.commit()
        except Exception as e:
            print(e)

    def format_auth_user(self):        
        self.df['first_name'] = self.df['Nome'].str.split().str[:-1].str.join(' ')
        self.df['last_name'] = self.df['Nome'].str.split().str[-1:]
        self.df['last_name'] = self.df['last_name'].str.join(' ')
        self.df = self.df.rename(columns={'Email': 'email'})
        self.df['password'] = 'fraguismo'
        self.df['is_superuser'] = 0
        self.df['username'] = self.df['first_name'].str.split().str[0] + '_' + self.df['last_name']
        self.df['is_staff'] = 0
        self.df['is_active'] = 1
        self.df['date_joined'] = datetime.datetime.now()
        self.df['username'][58] = self.df.iloc[58].username = 'Felipe_Oliveira1'
        self.df['username'][223] = 'Vítor_Oliveira1'

    def format_member_user(self):
        self.df = self.df.rename(columns={'Telefone': 'fone', 'Local': 'city', 'Insta': 'instagram', 'Data_de_nascimento': 'birth', 'Trabalho':'job_title'})
        self.df['bsc_wallet'] =' '
        self.df['como_conheceu'] = ' '
        self.df['quem_indicou'] = ' '
        self.df['aonde'] = ' '
        self.df['instagram'].fillna(' ', inplace=True)
        self.df['birth'].fillna(' ', inplace=True)
        self.df['job_title'].fillna(' ', inplace=True)
        

    def format_members_profile(self):        
        self.df = self.df.rename(columns={'OBS': 'observacao', 'Pontos': 'pontuacao', 'Outras_pendencias': 'pendencias', 'Equipe': 'squad', 'id': 'user_id', 'Nivel': 'nivel'})
        self.df['observacao'].fillna(' ', inplace=True)
        self.df['squad'].fillna(' ', inplace=True)
        self.df['pendencias'].fillna(' ', inplace=True)
        self.df['pontuacao'].fillna(0, inplace=True)

    def print_example(self):
        length = len(self.users)
        for i in range(length):
            print(f'{self.users[i].first_name} - {self.member_profiles[i].pendencias} - {self.member_users[i].instagram}')

if __name__ == "__main__":
    insert = InsertDB()
    
    