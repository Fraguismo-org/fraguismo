from members.models.profile import Profile

def can_create_proposal(user):
    try:
        profile = Profile.get_or_create_profile(user)
        return profile.nivel_id.id >= 4
    except:
        return False
    
def can_vote_proposal(user, proposal=None):
    try:
        profile = Profile.get_or_create_profile(user)
        return profile.nivel_id.id >= 5 and proposal.user.id != user.id
    except:
        return False