from administrador import models


NIVEL_CHOICES = [
        ('aprendiz', 'Aprendiz'),
        ('escudeiro', 'Escudeiro'),
        ('cavaleiro', 'Cavaleiro'),
        ('conselheiro', 'Conselheiro'),
        ('guardiao', 'Guardião'),
        ('nao_fraguista', 'Não Fraguista')
    ]

class NivelChoices:
    APPRENTICE = 'aprendiz'
    SQUIRE = 'escudeiro'
    KNIGHT = 'cavaleiro'
    COUNSELOR = 'conselheiro'
    GUARDIAN = 'guardião'
    NOFRAGUISTA = 'não fraguista'
    