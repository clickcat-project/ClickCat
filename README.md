![image](https://user-images.githubusercontent.com/22762150/172976873-90907210-9450-4699-adcf-d23daa5ea866.png)

ClickCat is a firendly user interface that lets you search,explore and visualize your ClickHouse Data. 

We provides the following features,you can access http://8.135.49.240:8080/ to try directly without any installing.
# Features
* An online SQL editor  which can run your SQL code without any installing.
* You can observe all processes and mutations. For those unfinished processes, you can kill them in ui.
* The Metrics contains Cluster Analysis,Data Analysis,Query Analysis. 
* Time-series Prediction use time series modeling to detect anomalies in your current data and forecast trends based on historical data in Clickhouse.
<img src="https://user-images.githubusercontent.com/22762150/172766700-de6b755c-0f9d-47e3-b0e3-fbb72ca06f23.png" width="500" />

# The next we are developing
* A Discover module like Kibana Discover which can quickly search and filter your data, get information about the structure of the fields.
<img src="https://user-images.githubusercontent.com/22762150/172767245-4367c1ed-e019-48c3-a980-b6bdacf3a826.png" width="500"/>

* A Graph Analysis feature enable you to model,explore,visualize connected data hided in Clickhouse.
<img src="https://user-images.githubusercontent.com/22762150/172766866-338525eb-b75a-43e4-96fb-c266b81c7457.png" width="500"/>

# Install
```bash
npm install -g pnpm
pnpm install
pnpm dev
```

