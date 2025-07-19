from members.models.profile import Profile

def can_create_proposal(user):
    try:
        profile = Profile.get_or_create_profile(user)
        return profile.nivel_id.pontuacao_base >= 40
    except:
        return False
