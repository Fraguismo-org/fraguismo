from services.query_type import QueryType
import re

class QueryFilterService:
    @staticmethod
    def query_type(query) -> QueryType:
        if re.match(r'^(\+?\d{1,3})? ?(\(?\d{2,3}\)?)? ?\d{4,5}-?\d{4}$', query):
            return QueryType.PHONE
        elif re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', query):
            return QueryType.EMAIL	
        elif query.isdigit():
            return QueryType.ID
        elif query.startswith('@'):
            return QueryType.INSTAGRAM
        else:
            return QueryType.USERNAME