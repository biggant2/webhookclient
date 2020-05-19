function submit() {
    let url = $('#iWUrl').val();
    if(!/http(s?):\/\/discord(app)?.com\/api\/(v6\/)?webhooks\/[0-9]+\/.+/g.test(url)) {
        return alert("Please provide a valid webhook url.");
    }

    let message = $('#iMessage').val();
    if(message.length > 2000) {
        return alert("Message must be less than 2000 characters.");
    }

    let embed;
    try {
        embed = JSON.parse($('#iEmbed').val());
    } catch(err) {
        embed = "";
    }
    let pfp = $('#iUrl').val();
    let username = $('#iUsername').val();
    let files = $('#files').prop('files');

    let options = {
        content: message,
        username: username,
        avatar_url: pfp,
        embeds: embed
    }

    if(files.length === 0) {
        sendWebhook(url, options);
    } else {
        for(let i = 0; i < files.length; i++) {
            options[`file${i + 1}`] = files[i];
        }

        sendWebhookWithFiles(url, options);
    }
}

function sendWebhook(url, options) {
    Object.keys(options).forEach((key) => (options[key] == "") && delete options[key]);
    console.log(JSON.stringify(options))

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(options)
    })
        .then(response => console.log(response.status))
}

function sendWebhookWithFiles(url, options) {
    Object.keys(options).forEach((key) => (options[key] == "") && delete options[key]);
    let formData = new FormData();
    let payload = { }

    for(option in options) {
        if(option.startsWith("file")) {
            formData.append(option, options[option])
        } else {
            payload[option] = options[option]
        }
    }

    formData.append("payload_json", JSON.stringify(payload));

    fetch(url, {
        method: 'POST',
        body: formData
    })
        .then(response => console.log(response.status))
}