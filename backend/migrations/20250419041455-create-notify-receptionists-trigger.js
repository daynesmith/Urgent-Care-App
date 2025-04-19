'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
// Create the stored procedure
await queryInterface.sequelize.query(`
  DELIMITER //
  CREATE PROCEDURE NotifyReceptionists(IN msg TEXT)
  BEGIN
    INSERT INTO Notifications (recipientid, senderid, message, type, is_read)
    SELECT userid, NULL, msg, 'general', FALSE
    FROM Users
    WHERE role = 'receptionist';
  END;
  //
  DELIMITER ;
`);

// Create the trigger
await queryInterface.sequelize.query(`
  DELIMITER //
  CREATE TRIGGER notify_on_bill_paid
  AFTER UPDATE ON Billings
  FOR EACH ROW
  BEGIN
    IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
      CALL NotifyReceptionists(CONCAT('Bill #', NEW.billingid, ' has been paid.'));
    END IF;
  END;
  //
  DELIMITER ;
`);
  },

  async down (queryInterface, Sequelize) {
// Drop the trigger
await queryInterface.sequelize.query(`
  DROP TRIGGER IF EXISTS notify_on_bill_paid;
`);

// Drop the stored procedure
await queryInterface.sequelize.query(`
  DROP PROCEDURE IF EXISTS NotifyReceptionists;
`);
  }
};
