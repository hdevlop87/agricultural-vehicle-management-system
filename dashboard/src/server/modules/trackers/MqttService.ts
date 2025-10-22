import { Injectable } from 'najm-api';
import { Mqtt } from 'await-mqtt';
import { TrackerService } from './TrackerService';


@Injectable()
export class MqttService {

  private mqttClient = null;
  public isConnected = false;
  private readonly vehicleTrackerTopic = process.env.NEXT_PUBLIC_TOPIC_VEHICLES_TRACKER_DATA;
  private readonly operatorTrackerTopic = process.env.NEXT_PUBLIC_TOPIC_OPERATORS_TRACKER_DATA;

  constructor(
    private trackerService: TrackerService
  ) {}


  async initializeMqttConnection() {

    this.mqttClient = await Mqtt({
      url: process.env.MQTT_BROKER_URL,
      clientId: `agri_backend_${Date.now()}`,
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
      clean: true,
      keepalive: 30,
      autoReconnect: true,
      reconnectInterval: 5000,
      maxReconnectAttempts: 10
    });

    this.isConnected = true;

    await this.setupSubscriptions();
    await this.setupMessageHandlers()
  }

  async setupSubscriptions() {
    await this.mqttClient.subscribe(this.vehicleTrackerTopic);
    await this.mqttClient.subscribe(this.operatorTrackerTopic);
  }

  private setupMessageHandlers() {
    this.mqttClient.onMessage(this.vehicleTrackerTopic, this.handleVehicleTrackerData.bind(this));
    this.mqttClient.onMessage(this.operatorTrackerTopic, this.handleOperatorTrackerData.bind(this));
  }

  private async handleVehicleTrackerData(topic, message) {
    // MQTT handlers removed - using HTTP polling instead
  }

  private async handleOperatorTrackerData(topic, message) {
    // MQTT handlers removed - using HTTP polling instead
  }
}