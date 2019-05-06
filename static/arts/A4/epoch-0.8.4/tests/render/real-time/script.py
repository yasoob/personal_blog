from random import randint
import threading
from pprint import pprint
from pubnub.pubnub import PubNub
from pubnub.pnconfiguration import PNConfiguration
from datetime import datetime
import time

pnconfig = PNConfiguration()

pnconfig.subscribe_key = 'demo'
pnconfig.publish_key = 'demo'
 
pnconfig.publish_key="pub-c-8f48adb8-8ed7-4c55-96f5-b45fe61b46bb" 
pnconfig.subscribe_key="sub-c-56550f92-66fc-11e9-a1d1-12440c6cd251"

pn = PubNub(pnconfig)

def my_publish_callback(envelope, status):
    #print(status.original_response)
    pass

def loop():
    threading.Timer(2, loop).start()
    temp = randint(15, 30)
    
    #light = randint(600, 700)
    light = randint(700, 900)
    
    #moisture = randint(500,900)
    moisture = randint(900,1000)

    #temp = randint(0, 255)
    #light = randint(0, 255)
    #moisture = randint(0,255)


    # print(num)
    #dt = datetime.now()
    #timestamp = int((time.mktime(dt.timetuple()) + dt.microsecond/1000000.0)*1000)
    timestamp = time.time()
    temp_data = dict(time=timestamp, y=temp)
    light_data = dict(time=timestamp, y=light)
    moisture_data = dict(time=timestamp, y=moisture)
    final_data = [temp_data, light_data, moisture_data]
    print(final_data)
    pn.publish().channel("epoch-pubnub").message(final_data).pn_async(my_publish_callback)
    #pn.publish().channel("temp-pubnub").message(temp_data).pn_async(my_publish_callback)
    
if __name__ == "__main__":
    loop()