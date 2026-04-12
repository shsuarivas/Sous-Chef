import styles from './NotificationsPage.module.scss';                                                       
                                                                                                              
  function Notification({ message }) {                                                                        
      return (    
          <div className={styles.notification_div}>                                                           
              {message}
          </div>
      );
  }

  export default function NotificationsPage() {
      return (
          <div className={styles.main_div}>                                                                   
              <Notification message="A new recipe was added!" />
              <Notification message="A new recipe was added!" />                                              
              <Notification message="A new recipe was added!" />
          </div>                                                                                              
      );
  }                           