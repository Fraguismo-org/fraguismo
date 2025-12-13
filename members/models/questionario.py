from django.db import models
from members.models.profile import Profile

class Questionario(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)

    help_project = models.TextField(blank=True)
    reason_to_participate = models.TextField(blank=True)
    reason_to_accept = models.TextField(blank=True)
    political_belief = models.TextField(blank=True)
    state_opinion = models.TextField(blank=True)
    jusnaturalismo_vs_juspositivismo = models.TextField(blank=True)
    economic_values = models.TextField(blank=True)
    bitcoin_positive_characteristics = models.TextField(blank=True)
    game_theory_byzantine_generals = models.TextField(blank=True)
    pna_and_argumentative_ethics = models.TextField(blank=True)
    libertarian_knowledge_sources = models.TextField(blank=True)
    bitcoin_knowledge_sources = models.TextField(blank=True)
    # checklist de contato
    contato_realizado = models.BooleanField(default=False)
    contato_data = models.DateTimeField(null=True, blank=True)
    contato_observacao = models.TextField(blank=True)

    def __str__(self):
        return f"Questionário de {self.profile.user.username}"
