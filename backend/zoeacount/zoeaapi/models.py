from django.db import models

# Create your models here.

class ZoeaTable(models.Model):
    id = models.IntegerField(primary_key=True, auto_created=True, unique=True)
    img_blob = models.ImageField(default=None)
    timestamp = models.DateTimeField(auto_now_add=True)
    age = models.IntegerField(default=0, blank=True, null=True)
    phase = models.IntegerField(default=0, blank=True, null=True)
    count_data = models.IntegerField(default=0)
    mortality_rate = models.FloatField(default=0)
    cumulative_mortality_rate = models.FloatField(default=0)



