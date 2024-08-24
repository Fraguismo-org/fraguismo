from datetime import datetime
import sqlalchemy as sa
from sqlalchemy.orm import declarative_base


engine =  sa.create_engine("mysql+mysqlconnector://dev:devpassword@localhost/dev",
                                pool_recycle=3600, echo=True)

Base = declarative_base()

metadata = sa.MetaData()
metadata.reflect(bind=engine)



class AuthUser(Base):
    __table__ = sa.Table("auth_user", metadata)

    def __init__(self, id, first_name, last_name, email, password, is_superuser, username, is_staff, is_active, date_joined) -> None:
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.is_superuser = is_superuser
        self.username = username
        self.is_staff = is_staff
        self.is_active = is_active
        self.date_joined =date_joined

    def __str__(self) -> str:
        return f"{self.username}, {self.email}"

class MemberProfile(Base):
    __table__ = sa.Table('members_profile', metadata)

    def __init__(self, id, nivel, pontuacao, observacao, pendencias, squad, user_id):
        self.id = id
        self.nivel = nivel
        self.pontuacao = pontuacao
        self.observacao = observacao
        self.pendencias = pendencias
        self.squad = squad
        self.user_id = user_id

class MemberUser(Base):
    __table__ = sa.Table('members_user', metadata)
    def __init__(self, user_ptr_id, city, fone, instagram, birth, job_title, bsc_wallet, como_conheceu, quem_indicou, aonde):
        self.user_ptr_id = user_ptr_id
        self.city = city
        self.fone = fone
        self.instagram = instagram
        self.birth = birth
        self.job_title = job_title
        self.bsc_wallet = bsc_wallet
        self.como_conheceu = como_conheceu
        self.quem_indicou = quem_indicou
        self.aonde = aonde

Session = sa.orm.sessionmaker(engine)
session = Session()