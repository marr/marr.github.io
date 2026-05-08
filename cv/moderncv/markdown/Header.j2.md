{% if cv.name %}
# {{ cv.name }}'s CV (CUSTOM TEMPLATE)
{% endif %}

{% if cv.phone %}
- Phone: {{cv.phone|replace("tel:", "")|replace("-"," ")}}
{% endif %}
{% if cv.email %}
- Email: [{{cv.email}}](mailto:{{cv.email}})
{% endif %}
{% if cv.location %}
- Location: {{cv.location}}
{% endif %}
{% if cv.website %}
- [{{cv.website|replace("https://","")|replace("/","")}}]({{cv.website}})
{% endif %}
{% if cv.social_networks %}
    {% for network in cv.social_networks %}
- [{{network.username}}]({{network.url}})
    {% endfor %}
{% endif %}
