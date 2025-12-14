import os
from pathlib import Path
from dotenv import load_dotenv
import django_heroku
import dj_database_url
from decouple import config

# Load environment variables
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# -------------------------------------------------------------------
# SECURITY
# -------------------------------------------------------------------
SECRET_KEY = os.getenv('SECRET_KEY', 'unsafe-secret-key')
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
ALLOWED_HOSTS = [
        'production-europe-west4-drams3a.railway-registry.com',
        'railway.app',
        'hiringpot-production.up.railway.app',
        'tolleya.com',
        'www.tolleya.com',
        '127.0.0.1',
]  # Railway gives dynamic domains

# -------------------------------------------------------------------
# APPLICATIONS
# -------------------------------------------------------------------
INSTALLED_APPS = [
    "django_extensions",
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    "crispy_forms",
    "crispy_bootstrap5",

    "rest_framework",
    "django_filters",

    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'django.contrib.sites',

    'rest_framework_simplejwt',
    'channels',
    'corsheaders',
    'phonenumber_field',

    'hiring',
]

AUTH_USER_MODEL = 'hiring.CustomUser'

# -------------------------------------------------------------------
# MIDDLEWARE
# -------------------------------------------------------------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',

    # WhiteNoise for static files
    'whitenoise.middleware.WhiteNoiseMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'benta.urls'

# -------------------------------------------------------------------
# TEMPLATES
# -------------------------------------------------------------------
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'benta.wsgi.application'

# -------------------------------------------------------------------
# DATABASE — AUTO Railway support
# -------------------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL")

is_local = os.environ.get('DJANGO_LOCAL', 'false').lower() == 'true'

if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3"
        }
    }

# -------------------------------------------------------------------
# AWS S3 STORAGE
# -------------------------------------------------------------------
#aws database

# ==============================
# AWS S3 STORAGE (FINAL WORKING)
# ==============================

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME")
AWS_S3_REGION_NAME = "af-south-1"

AWS_S3_ENDPOINT_URL = "https://s3.af-south-1.amazonaws.com"
AWS_S3_FILE_OVERWRITE = False

STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
        "OPTIONS": {
            "access_key": AWS_ACCESS_KEY_ID,
            "secret_key": AWS_SECRET_ACCESS_KEY,
            "bucket_name": AWS_STORAGE_BUCKET_NAME,
            "endpoint_url": AWS_S3_ENDPOINT_URL,
            "region_name": AWS_S3_REGION_NAME,
        },
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

MEDIA_URL = f"https://{AWS_STORAGE_BUCKET_NAME}.s3.{AWS_S3_REGION_NAME}.amazonaws.com/media/"

STATIC_URL = 'static/'
#django databse settings
django_heroku.settings(locals())
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

#MEDIA_URL = '/mediafiles/'
#MEDIA_ROOT = os.path.join(BASE_DIR, 'static/mediafiles')

STATICFILES_STORAGE = "whitenoise.storage.CompressedStaticFilesStorage" 

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static')
]

#end
MAX_UPLOAD_SIZE = 314572800  # 300MB in bytes
DATA_UPLOAD_MAX_MEMORY_SIZE = 314572800  # 300MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 314572800  # 300MB

# Add to Django settings
FILE_UPLOAD_HANDLERS = [
    'django.core.files.uploadhandler.MemoryFileUploadHandler',
    'django.core.files.uploadhandler.TemporaryFileUploadHandler',
]


# -------------------------------------------------------------------
# PASSWORD VALIDATION
# -------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

# -------------------------------------------------------------------
# INTERNATIONALIZATION
# -------------------------------------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# -------------------------------------------------------------------
# STATIC & MEDIA
# -----------------------------------------

# -------------------------------------------------------------------
# ALLAUTH
# -------------------------------------------------------------------
SITE_ID = 1
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = 'username_email'
ACCOUNT_EMAIL_VERIFICATION = 'optional'
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_LOGOUT_REDIRECT_URL = '/'
LOGIN_REDIRECT_URL = '/dashboard/'
ACCOUNT_SIGNUP_REDIRECT_URL = '/profile/edit/'

# -------------------------------------------------------------------
# REST FRAMEWORK
# -------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}

# -------------------------------------------------------------------
# EMAIL
# -------------------------------------------------------------------
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL')

# -------------------------------------------------------------------
# OTHER CONFIGS
# -------------------------------------------------------------------
CRISPY_ALLOWED_TEMPLATE_PACKS = "bootstrap5"
CRISPY_TEMPLATE_PACK = "bootstrap5"

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

RESIDENT_ID_PREFIX = os.getenv('RESIDENT_ID_PREFIX', 'ugr')
BUSINESS_ID_PREFIX = os.getenv('BUSINESS_ID_PREFIX', 'lec')

DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
