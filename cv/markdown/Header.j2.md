{% if cv.name %}
# {{ cv.name }}'s CV
{% endif %}

{% if cv.email %}
- [{{cv.email}}](mailto:{{cv.email}})
{% endif %}
{% if cv.location %}
- {{cv.location}}
{% endif %}
{% if cv.website %}
- [{{cv.website|replace("https://","")|replace("/","")}}]({{cv.website}})
{% endif %}
{% if cv.social_networks %}
    {% for network in cv.social_networks %}
- [{{network.username}}]({{network.url}})
    {% endfor %}
{% endif %}
