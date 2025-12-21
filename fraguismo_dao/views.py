from django.shortcuts import redirect, render


def fraguismo_dao(request):
    return render(request, 'fraguismo_dao.html')