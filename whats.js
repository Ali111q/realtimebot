const myHeaders = new Headers();
myHeaders.append("Authorization", "App 55689991c7f00119cb5ee29128086405-0d8881a2-98db-4449-9718-845542b41e19");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "application/json");

const raw = JSON.stringify({
    "messages": [
        {
            "from": "447860099299",
            "to": "9647737503949",
            "messageId": "c8b8f670-01a9-42af-ac16-6887fe56de86",
            "content": {
                "templateName": "message_test",
                "templateData": {
                    "body": {
                        "placeholders": ["Ali"]
                    }
                },
                "language": "en"
            }
        }
    ]
});

const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
};

fetch("https://mmjp9j.api.infobip.com/whatsapp/1/message/template", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));