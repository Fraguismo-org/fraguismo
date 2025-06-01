from django.shortcuts import render
from log.models.log import Log


def custom_page_not_found_view(request, exception):
    Log.salva_log(exception)
    return render(request, 'error/404.html', {}, status=404)

def custom_server_error_view(request):
    Log.salva_log("Error 500")
    return render(request, 'error/500.html', {}, status=500)

def custom_permission_denied_view(request, exception):
    Log.salva_log(exception)
    return render(request, 'error/403.html', {}, status=403)

def custom_bad_request_view(request, exception):
    Log.salva_log(exception)
    return render(request, 'error/400.html', {}, status=400)