export const banksConfig = [
  {
    name: 'HDFC',
    gmailFilter: {
      from: 'alerts@hdfcbank.net',
      exclude: 'OTP is',
    },
    regexList: [
      {
        mode: 'RD',
        type: 'deposit',
        regex:
          /Dear Customer, REMINDERMonthly Instalment of INR (?<amount>[\d,]*\.\d{2}) towards your RD (?<party>.*) is due on (?<date>.*). We request you to maintain sufficient funds in the account./,
      },
      {
        mode: 'UPI',
        type: 'debit',
        regex:
          /Dear Customer,  Rs\.(?<amount>[\d,]*\.\d{2}) has been debited from account (?<account>.*) to VPA (?<party>.*) on (?<date>.*)\. Your UPI transaction reference number is (?<ref>.*)\./,
      },
      {
        mode: 'UPI',
        type: 'debit',
        regex:
          /Rs.(?<amount>[\d,]*\.\d{2}) has been debited from account (?<account>.*) to VPA (?<party>.*) on (?<date>.*).Your UPI transaction reference number is (?<ref>.*)./,
      },
      {
        mode: 'Debit Card',
        type: 'debit',
        regex:
          /Dear Card Member,  Thank you for using your HDFC Bank Debit Card ending (?<account>.*) for Rs (?<amount>[\d,]*\.\d{2}) at (?<party>.*) on (?<date>.*) (?<time>.*)\.  After the above transaction, the available balance on your card is Rs (?<balance>[\d,]*\.\d{2})\./,
      },
      {
        mode: 'Debit Card',
        type: 'debit',
        regex:
          /Dear Card Member,  Thank you for using your HDFC Bank Debit Card ending (?<account>.*) for ATM withdrawal for Rs (?<amount>[\d,]*\.\d{2}) in (?<location>.*) at (?<party>.*) on (?<date>.*) (?<time>.*)\.  After the above transaction, the total available balance on your card is Rs (?<balance>[\d,]*\.\d{2})\./,
      },
      {
        mode: 'Credit Card',
        type: 'debit',
        regex:
          /Dear Card Member,  Thank you for using your HDFC Bank Credit Card ending (?<account>.*) for Rs (?<amount>[\d,]*\.\d{2}) at (?<party>.*) on (?<date>.*) (?<time>.*)\.  After the above transaction, the available balance on your card is Rs (?<balance>[\d,]*\.\d{2}) and the total outstanding is Rs (?<outstanding>[\d,]*\.\d{2})/,
      },
      {
        mode: 'NetBanking',
        type: 'debit',
        regex:
          /Dear Customer,    This is to inform you that an amount of Rs\. (?<amount>[\d,]*\.\d{2}) has been debited from your account No\. (?<account>.*) on account of (?<party>.*) done using HDFC Bank NetBanking \./,
      },
      {
        mode: 'NEFT',
        type: 'debit',
        regex:
          /Dear Customer, Amount of INR (?<amount>[\d,]*\.\d{2}) has been debited from A\/c (?<account>.*) at (?<location>.*) on account of (?<party>.*) on (?<date>.*)\.Available balance is INR (?<balance>[\d,]*\.\d{2})/,
      },
      {
        mode: 'NEFT',
        type: 'debit',
        regex:
          /Dear Customer,    This is to inform you that an amount of Rs. (?<amount>[\d,]*\.\d{2}) has been debited from your account No. (?<account>.*) on account of National Electronic Funds Transfer transaction using HDFC Bank NetBanking./,
      },
      {
        mode: 'NEFT',
        type: 'credit',
        regex:
          /Dear Customer, Amount of INR (?<amount>[\d,]*\.\d{2}) has been credited to A\/c (?<account>.*) at (?<accountLoc>.*) on account of (?<party>.*) on (?<date>.*)\.Available balance is INR (?<balance>[\d,]*\.\d{2})/,
      },
      {
        mode: 'IMPS',
        type: 'debit',
        regex:
          /Dear Customer,Your A\/c (?<account>.*) is debited for INR (?<amount>[\d,]*\.\d{2}) on (?<date>.*) and A\/c (?<party>.*) is credited\.\(IMPS Ref No. (?<ref>.*)\)\.Available balance is INR (?<balance>[\d,]*\.\d{2})\./,
      },
      {
        mode: 'NetBanking',
        type: 'debit',
        regex:
          /Dear Customer,   Thank you for using HDFC Bank NetBanking for payment of Rs\.(?<amount>[\d,]*\.\d{2}) from A\/c (?<account>.*) to (?<party>.*)   As a thank you gesture from us, go ahead and enjoy this offer/,
      },
    ],
  },
];
