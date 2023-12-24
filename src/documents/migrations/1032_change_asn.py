# Generated by Django 4.1.5 on 2023-03-06 19:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '1031_alter_document_added'),
    ]

    operations = [
        migrations.RunSQL('UPDATE documents_document SET archive_serial_number = CAST(SUBSTRING(archive_serial_number,-3) || SUBSTRING(archive_serial_number,-3,-2) AS INTEGER)')
    ]