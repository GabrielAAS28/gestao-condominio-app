import PushNotification from 'react-native-push-notification';

class NotificationService {
  constructor() {
    this.configure();
  }

  configure = () => {
    PushNotification.configure({
      // O token recebido aqui pode ser enviado para o seu backend para
      // que você possa enviar notificações push direcionadas no futuro.
      onRegister: function (token) {
     
        console.log('Dispositivo registado para notificações.');
      },
      onNotification: function (notification) {
        console.log('NOTIFICAÇÃO RECEBIDA:', notification);
        // Processar a notificação aqui
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    PushNotification.createChannel(
      {
        channelId: "default-channel-id", // (obrigatório)
        channelName: "Canal Padrão", // (obrigatório)
        channelDescription: "Um canal para notificações do app",
        soundName: "default",
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Canal de notificação criado: '${created}'`)
    );
  };

  // Função para disparar uma notificação local
  localNotification = (title, message) => {
    PushNotification.localNotification({
      channelId: "default-channel-id",
      autoCancel: true,
      title: title,
      message: message,
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
    });
  };
}

export const notificationService = new NotificationService();
