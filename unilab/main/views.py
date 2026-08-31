from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def departments(request):
    data = [
        {"title": "School of Computing", "dean": "Dr. Aris Thorne",
         "body": "Leading the paradigm shift in hardware-software co-design..."},
        {"title": "Humanities & Philosophy", "dean": "Prof. Beatrice Vance",
         "body": "Exclusively structured to foster deep ethical inquiry..."},
        {"title": "School of Business", "dean": "Dr. Marcus Stirling",
         "body": "Empowering next-generation executives..."},
    ]
    return Response(data)