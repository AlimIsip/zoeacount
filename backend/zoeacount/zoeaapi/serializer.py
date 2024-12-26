from rest_framework import serializers
from .models import ZoeaTable

class ZoeaTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZoeaTable
        fields = '__all__'
        depth = 1

    # def create(self, validated_data):
    #     # Get 'img_blob' directly from request.FILES
    #     img_blob = self.context['request'].FILES.get('img_blob')
    #
    #     # Read the file as binary data
    #     if img_blob:
    #         validated_data['img_blob'] = img_blob.read()
    #
    #     return ZoeaTable.objects.create(**validated_data)