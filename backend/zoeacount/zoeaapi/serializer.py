from email.headerregistry import Group

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from .models import ZoeaTable, ZoeaBatch
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class ZoeaTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZoeaTable
        fields = '__all__'
        depth = 1

class ZoeaBatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZoeaBatch
        fields = '__all__'
        depth = 1

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'date_joined', 'last_login', 'role']

    def get_role(self, obj):
        return obj.groups.first().name if obj.groups.exists() else None

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        group = user.groups.order_by('name').first()  # Get the first group alphabetically
        token['role'] = group.name if group else None # Add the group name or None if no group exists
        token['name'] = user.username if user else None
        # ...
        return token



    # def create(self, validated_data):
    #     # Get 'img_blob' directly from request.FILES
    #     img_blob = self.context['request'].FILES.get('img_blob')
    #
    #     # Read the file as binary data
    #     if img_blob:
    #         validated_data['img_blob'] = img_blob.read()
    #
    #     return ZoeaTable.objects.create(**validated_data)