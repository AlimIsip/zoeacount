from django.db import models

# Create your models here.

class ZoeaTable(models.Model):
    id = models.IntegerField(primary_key=True, auto_created=True, unique=True)
    batch = models.IntegerField(default=0, blank=True, null=True)
    img_blob = models.ImageField(default=None)
    datestamp = models.DateField(auto_now_add=True)
    timestamp = models.TimeField(auto_now_add=True)
    age = models.IntegerField(default=0, blank=True, null=True)
    phase = models.IntegerField(default=0, blank=True, null=True)
    count_data = models.IntegerField(default=0)
    mortality_rate = models.FloatField(default=0)
    cumulative_mortality_rate = models.FloatField(default=0)
    captured_by = models.CharField(blank=True, null=True, max_length=255)

class ZoeaBatch(models.Model):
    id = models.IntegerField(primary_key=True, auto_created=True, unique=True)
    batch = models.IntegerField(default=0, blank=True, null=True)
    start_datetime = models.DateTimeField(blank=True, null=True)
    end_datetime = models.DateTimeField(blank=True, null=True)
    end_phase = models.IntegerField(default=0, blank=True, null=True)
    count_data = models.IntegerField(default=0)
    mortality_rate = models.FloatField(default=0)




