from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Profile

# --- 1. REGISTER SERIALIZER ---
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

# --- 2. LOGIN SERIALIZER ---
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Username atau Password salah.")

# --- 3. PROFIL SERIALIZER (GET & EDIT INFO) ---
class UserProfileSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        # GANTI first_name & last_name MENJADI full_name
        fields = ['id', 'username', 'email', 'full_name', 'image_url']
        read_only_fields = ['id']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if hasattr(obj, 'profile') and obj.profile.image and hasattr(obj.profile.image, 'url'):
            return request.build_absolute_uri(obj.profile.image.url)
        return None

# --- 4. SERIALIZER GANTI FOTO ---
class ProfileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['image']

# --- 5. SERIALIZER GANTI PASSWORD ---
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': "Password baru tidak cocok."})
        return data