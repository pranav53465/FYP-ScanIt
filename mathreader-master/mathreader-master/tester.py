# importing the requests library 
import requests 
import json
#https://res.cloudinary.com/df0ybxc6g/image/upload/v1616330476/Submissions/ugsck37d8cnhwqozoknv.jpg
#https://res.cloudinary.com/df0ybxc6g/image/upload/v1616330632/Submissions/ybbkslkn2oa01thidbm3.jpg 
# defining the api-endpoint 
#IMG_URL = 'https://res.cloudinary.com/df0ybxc6g/image/upload/v1616330632/Submissions/ybbkslkn2oa01thidbm3.jpg'

IMG_URL = 'https://res.cloudinary.com/df0ybxc6g/image/upload/v1616330476/Submissions/ugsck37d8cnhwqozoknv.jpg'

API_ENDPOINT = 'http://0.0.0.0:5226/recognize'
# data to be sent to api 
data = {'img_url': IMG_URL} 
data = json.dumps(data)
headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8' 
}

# sending post request and saving response as response object 
r = requests.get(url = API_ENDPOINT, data=data, headers=headers) 
#r = requests.post(url = API_ENDPOINT, data = data, headers=headers) 

print("Result from Math Reader", r.json())


 