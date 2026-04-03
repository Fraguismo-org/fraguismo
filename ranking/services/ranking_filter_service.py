from services.query_filter_service import QueryFilterService
from services.query_type import QueryType


def filter_ranking(ranking, query):
    if not query:
        return ranking

    query = query.strip().lower()
    query_type = QueryFilterService.query_type(query)

    def matches(entry):
        user = entry["profile"].user
        full_name = f"{user.first_name} {user.last_name}".lower()

        match query_type:
            case QueryType.EMAIL:
                return user.email.lower().startswith(query)
            case QueryType.ID:
                return str(user.id) == query
            case _:
                return (
                    query in user.username.lower()
                    or query in user.email.lower()
                    or query in full_name
                )

    return [item for item in ranking if matches(item)]
