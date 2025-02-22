from email.headerregistry import Group

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ZoeaTable, ZoeaBatch
from datetime import datetime
from django.contrib.auth.models import Group

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

class UserCreateSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True, required=False)  # Allow role updates
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'role']

    def update(self, instance, validated_data):
        role_name = validated_data.pop("role", None)  # Extract role if provided
        password = validated_data.pop("password", None)  # Extract password if provided

        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # If password is provided, hash it
        if password:
            instance.set_password(password)

        # If role is provided, update the group
        if role_name:
            allowed_roles = {"admin": "admin", "staff": "staff"}
            if role_name not in allowed_roles:
                raise serializers.ValidationError({"role": "Invalid role provided"})

            # Clear old groups and assign the new one
            instance.groups.clear()
            group = Group.objects.filter(name=allowed_roles[role_name]).first()
            if group:
                instance.groups.add(group)
            else:
                raise serializers.ValidationError({"role": f"Group '{allowed_roles[role_name]}' does not exist."})

        instance.save()
        return instance


    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        group = user.groups.order_by('name').first()  # Get the first group alphabetically
        token['role'] = group.name if group else None # Add the group name or None if no group exists
        token['name'] = user.username if user else None


        if user:
            last_login = user.last_login.strftime("%B %d, %Y") if user.last_login else None
            date_joined = user.date_joined.strftime("%B %d, %Y") if user.date_joined else None
        else:
            last_login = None
            date_joined = None

        token['last_login'] = last_login
        token['date_joined'] = date_joined
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