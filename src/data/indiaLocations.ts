export interface IndiaState {
  code: string;
  name: string;
  type: 'state' | 'ut';
  capital: string;
  districts: {
    name: string;
    cities: {
      name: string;
      pincode: string;
      lat: number;
      lng: number;
      popularAreas: string[];
    }[];
  }[];
}

export const ALL_INDIAN_STATES_AND_UTS: IndiaState[] = [
  // 28 STATES
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    type: 'state',
    capital: 'Amaravati',
    districts: [
      {
        name: 'Visakhapatnam',
        cities: [
          {
            name: 'Visakhapatnam',
            pincode: '530001',
            lat: 17.6868,
            lng: 83.2185,
            popularAreas: ['MVP Colony', 'Gajuwaka', 'Madhurawada', 'Dwaraka Nagar', 'Siripuram'],
          },
        ],
      },
      {
        name: 'NTR (Vijayawada)',
        cities: [
          {
            name: 'Vijayawada',
            pincode: '520001',
            lat: 16.5062,
            lng: 80.648,
            popularAreas: ['Benz Circle', 'Governorpet', 'Moghalrajpuram', 'Patamata', 'Gunadala'],
          },
        ],
      },
      {
        name: 'Tirupati',
        cities: [
          {
            name: 'Tirupati',
            pincode: '517501',
            lat: 13.6288,
            lng: 79.4192,
            popularAreas: ['Bhavani Nagar', 'KT Road', 'AIR Bypass Road', 'Chandragiri'],
          },
        ],
      },
    ],
  },
  {
    code: 'AR',
    name: 'Arunachal Pradesh',
    type: 'state',
    capital: 'Itanagar',
    districts: [
      {
        name: 'Papum Pare',
        cities: [
          {
            name: 'Itanagar',
            pincode: '791111',
            lat: 27.0844,
            lng: 93.6053,
            popularAreas: ['Ganga Market', 'Zero Point', 'Naharlagun', 'Bank Tinali'],
          },
        ],
      },
    ],
  },
  {
    code: 'AS',
    name: 'Assam',
    type: 'state',
    capital: 'Dispur',
    districts: [
      {
        name: 'Kamrup Metropolitan',
        cities: [
          {
            name: 'Guwahati',
            pincode: '781001',
            lat: 26.1445,
            lng: 91.7362,
            popularAreas: ['GS Road', 'Paltan Bazaar', 'Beltola', 'Chandmari', 'Jalukbari', 'Dispur'],
          },
        ],
      },
      {
        name: 'Dibrugarh',
        cities: [
          {
            name: 'Dibrugarh',
            pincode: '786001',
            lat: 27.4728,
            lng: 94.912,
            popularAreas: ['Chowkidinghee', 'Graham Bazar', 'Amolapatty'],
          },
        ],
      },
    ],
  },
  {
    code: 'BR',
    name: 'Bihar',
    type: 'state',
    capital: 'Patna',
    districts: [
      {
        name: 'Patna',
        cities: [
          {
            name: 'Patna',
            pincode: '800001',
            lat: 25.5941,
            lng: 85.1376,
            popularAreas: ['Boring Road', 'Kankarbagh', 'Bailey Road', 'Patliputra Colony', 'Frazer Road', 'Rajendra Nagar'],
          },
        ],
      },
      {
        name: 'Gaya',
        cities: [
          {
            name: 'Gaya',
            pincode: '823001',
            lat: 24.7914,
            lng: 85.0002,
            popularAreas: ['Bodh Gaya Road', 'Civil Lines', 'AP Colony'],
          },
        ],
      },
    ],
  },
  {
    code: 'CG',
    name: 'Chhattisgarh',
    type: 'state',
    capital: 'Raipur',
    districts: [
      {
        name: 'Raipur',
        cities: [
          {
            name: 'Raipur',
            pincode: '492001',
            lat: 21.2514,
            lng: 81.6296,
            popularAreas: ['Shankar Nagar', 'Pandri', 'Telibandha', 'Civil Lines', 'Samta Colony'],
          },
        ],
      },
      {
        name: 'Durg-Bhilai',
        cities: [
          {
            name: 'Bhilai',
            pincode: '490001',
            lat: 21.1938,
            lng: 81.3509,
            popularAreas: ['Sector 6', 'Nehru Nagar', 'Supela'],
          },
        ],
      },
    ],
  },
  {
    code: 'GA',
    name: 'Goa',
    type: 'state',
    capital: 'Panaji',
    districts: [
      {
        name: 'North Goa',
        cities: [
          {
            name: 'Panaji',
            pincode: '403001',
            lat: 15.4909,
            lng: 73.8278,
            popularAreas: ['Miramar', 'Fontainhas', 'Campal', 'Porvorim', 'Candolim'],
          },
        ],
      },
      {
        name: 'South Goa',
        cities: [
          {
            name: 'Margao',
            pincode: '403601',
            lat: 15.2832,
            lng: 73.9862,
            popularAreas: ['Fatorda', 'Borda', 'Pajifond', 'Colva Road'],
          },
        ],
      },
    ],
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    type: 'state',
    capital: 'Gandhinagar',
    districts: [
      {
        name: 'Ahmedabad',
        cities: [
          {
            name: 'Ahmedabad',
            pincode: '380001',
            lat: 23.0225,
            lng: 72.5714,
            popularAreas: ['Navrangpura', 'Bodakdev', 'Satellite', 'Vastrapur', 'SG Highway', 'Maninagar', 'Prahlad Nagar'],
          },
        ],
      },
      {
        name: 'Surat',
        cities: [
          {
            name: 'Surat',
            pincode: '395001',
            lat: 21.1702,
            lng: 72.8311,
            popularAreas: ['Adajan', 'Vesu', 'Athwa Lines', 'Varachha', 'Piplod'],
          },
        ],
      },
      {
        name: 'Vadodara',
        cities: [
          {
            name: 'Vadodara',
            pincode: '390001',
            lat: 22.3072,
            lng: 73.1812,
            popularAreas: ['Alkapuri', 'Gotri', 'Fatehgunj', 'Manjalpur', 'Sayajigunj'],
          },
        ],
      },
    ],
  },
  {
    code: 'HR',
    name: 'Haryana',
    type: 'state',
    capital: 'Chandigarh',
    districts: [
      {
        name: 'Gurugram',
        cities: [
          {
            name: 'Gurugram',
            pincode: '122001',
            lat: 28.4595,
            lng: 77.0266,
            popularAreas: ['Cyber City', 'DLF Phase 1-5', 'Golf Course Road', 'Sohna Road', 'Sector 56', 'Sector 14'],
          },
        ],
      },
      {
        name: 'Faridabad',
        cities: [
          {
            name: 'Faridabad',
            pincode: '121001',
            lat: 28.4089,
            lng: 77.3178,
            popularAreas: ['Sector 15', 'Sector 21C', 'NIT Faridabad', 'Greenfield Colony'],
          },
        ],
      },
    ],
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
    type: 'state',
    capital: 'Shimla',
    districts: [
      {
        name: 'Shimla',
        cities: [
          {
            name: 'Shimla',
            pincode: '171001',
            lat: 31.1048,
            lng: 77.1734,
            popularAreas: ['The Mall', 'Chotta Shimla', 'Sanjauli', 'Kasumpti', 'Lakkar Bazar'],
          },
        ],
      },
    ],
  },
  {
    code: 'JH',
    name: 'Jharkhand',
    type: 'state',
    capital: 'Ranchi',
    districts: [
      {
        name: 'Ranchi',
        cities: [
          {
            name: 'Ranchi',
            pincode: '834001',
            lat: 23.3441,
            lng: 85.3096,
            popularAreas: ['Main Road', 'Harmu Housing Colony', 'Morabadi', 'Kanke Road', 'Doranda', 'Lalpur'],
          },
        ],
      },
      {
        name: 'East Singhbhum (Jamshedpur)',
        cities: [
          {
            name: 'Jamshedpur',
            pincode: '831001',
            lat: 22.8046,
            lng: 86.2029,
            popularAreas: ['Bistupur', 'Sakchi', 'Kadma', 'Sonari', 'Telco Colony'],
          },
        ],
      },
    ],
  },
  {
    code: 'KA',
    name: 'Karnataka',
    type: 'state',
    capital: 'Bengaluru',
    districts: [
      {
        name: 'Bengaluru Urban',
        cities: [
          {
            name: 'Bengaluru',
            pincode: '560001',
            lat: 12.9716,
            lng: 77.5946,
            popularAreas: ['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Jayanagar', 'Malleshwaram', 'JP Nagar', 'Electronic City', 'Hebbal'],
          },
        ],
      },
      {
        name: 'Mysuru',
        cities: [
          {
            name: 'Mysuru',
            pincode: '570001',
            lat: 12.2958,
            lng: 76.6394,
            popularAreas: ['Gokulam', 'Jayalakshmipuram', 'Kuvempunagar', 'Saraswathipuram', 'Vijayanagar'],
          },
        ],
      },
      {
        name: 'Dakshina Kannada',
        cities: [
          {
            name: 'Mangaluru',
            pincode: '575001',
            lat: 12.9141,
            lng: 74.856,
            popularAreas: ['Kadri', 'Bejai', 'Lalbagh', 'Hampankatta', 'Surathkal'],
          },
        ],
      },
    ],
  },
  {
    code: 'KL',
    name: 'Kerala',
    type: 'state',
    capital: 'Thiruvananthapuram',
    districts: [
      {
        name: 'Ernakulam',
        cities: [
          {
            name: 'Kochi',
            pincode: '682001',
            lat: 9.9312,
            lng: 76.2673,
            popularAreas: ['Kaloor', 'Panampilly Nagar', 'Edappally', 'Kadavanthra', 'Kakkayad', 'Fort Kochi', 'Marine Drive'],
          },
        ],
      },
      {
        name: 'Thiruvananthapuram',
        cities: [
          {
            name: 'Thiruvananthapuram',
            pincode: '695001',
            lat: 8.5241,
            lng: 76.9366,
            popularAreas: ['Kowdiar', 'Vellayambalam', 'Pattom', 'Kazhakoottam (Technopark)', 'Sasthamangalam', 'Palayam'],
          },
        ],
      },
      {
        name: 'Kozhikode',
        cities: [
          {
            name: 'Kozhikode',
            pincode: '673001',
            lat: 11.2588,
            lng: 75.7804,
            popularAreas: ['Mavoor Road', 'Nadakkavu', 'Palayam', 'Thondayad', 'Chevayur'],
          },
        ],
      },
    ],
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    type: 'state',
    capital: 'Bhopal',
    districts: [
      {
        name: 'Bhopal',
        cities: [
          {
            name: 'Bhopal',
            pincode: '462001',
            lat: 23.2599,
            lng: 77.4126,
            popularAreas: ['Arera Colony', 'MP Nagar', 'Kolar Road', 'Shahpura', 'TT Nagar'],
          },
        ],
      },
      {
        name: 'Indore',
        cities: [
          {
            name: 'Indore',
            pincode: '452001',
            lat: 22.7196,
            lng: 75.8577,
            popularAreas: ['Vijay Nagar', 'Palasia', 'Saket', 'AB Road', 'Rau', 'Bhawarkua'],
          },
        ],
      },
    ],
  },
  {
    code: 'MH',
    name: 'Maharashtra',
    type: 'state',
    capital: 'Mumbai',
    districts: [
      {
        name: 'Mumbai City & Suburban',
        cities: [
          {
            name: 'Mumbai',
            pincode: '400001',
            lat: 19.076,
            lng: 72.8777,
            popularAreas: ['Bandra West', 'Andheri West', 'Juhu', 'Powai', 'Dadar', 'Worli', 'Colaba', 'Borivali', 'Goregaon', 'Thane'],
          },
        ],
      },
      {
        name: 'Pune',
        cities: [
          {
            name: 'Pune',
            pincode: '411001',
            lat: 18.5204,
            lng: 73.8567,
            popularAreas: ['Kothrud', 'Baner', 'Viman Nagar', 'Aundh', 'Hinjawadi', 'Koregaon Park', 'Wakad', 'Hadapsar'],
          },
        ],
      },
      {
        name: 'Nagpur',
        cities: [
          {
            name: 'Nagpur',
            pincode: '440001',
            lat: 21.1458,
            lng: 79.0882,
            popularAreas: ['Dharampeth', 'Ramdaspeth', 'Civil Lines', 'Sadar', 'Manish Nagar'],
          },
        ],
      },
      {
        name: 'Nashik',
        cities: [
          {
            name: 'Nashik',
            pincode: '422001',
            lat: 19.9975,
            lng: 73.7898,
            popularAreas: ['College Road', 'Gangapur Road', 'Indira Nagar', 'Panchavati'],
          },
        ],
      },
    ],
  },
  {
    code: 'MN',
    name: 'Manipur',
    type: 'state',
    capital: 'Imphal',
    districts: [
      {
        name: 'Imphal West',
        cities: [
          {
            name: 'Imphal',
            pincode: '795001',
            lat: 24.817,
            lng: 93.9368,
            popularAreas: ['Thangal Bazar', 'Paona Bazar', 'Lamphelpat'],
          },
        ],
      },
    ],
  },
  {
    code: 'ML',
    name: 'Meghalaya',
    type: 'state',
    capital: 'Shillong',
    districts: [
      {
        name: 'East Khasi Hills',
        cities: [
          {
            name: 'Shillong',
            pincode: '793001',
            lat: 25.5788,
            lng: 91.8933,
            popularAreas: ['Police Bazar', 'Laitumkhrah', 'Labal', 'Nongthymmai'],
          },
        ],
      },
    ],
  },
  {
    code: 'MZ',
    name: 'Mizoram',
    type: 'state',
    capital: 'Aizawl',
    districts: [
      {
        name: 'Aizawl',
        cities: [
          {
            name: 'Aizawl',
            pincode: '796001',
            lat: 23.7271,
            lng: 92.7176,
            popularAreas: ['Bara Bazar', 'Zarkawt', 'Khatla', 'Chanmari'],
          },
        ],
      },
    ],
  },
  {
    code: 'NL',
    name: 'Nagaland',
    type: 'state',
    capital: 'Kohima',
    districts: [
      {
        name: 'Kohima',
        cities: [
          {
            name: 'Kohima',
            pincode: '797001',
            lat: 25.6751,
            lng: 94.1086,
            popularAreas: ['High School Junction', 'TCP Gate', 'Main Town'],
          },
        ],
      },
    ],
  },
  {
    code: 'OD',
    name: 'Odisha',
    type: 'state',
    capital: 'Bhubaneswar',
    districts: [
      {
        name: 'Khurda',
        cities: [
          {
            name: 'Bhubaneswar',
            pincode: '751001',
            lat: 20.2961,
            lng: 85.8245,
            popularAreas: ['Saheed Nagar', 'Nayapalli', 'Jayadev Vihar', 'Patia', 'Chandrasekharpur', 'Khandagiri'],
          },
        ],
      },
      {
        name: 'Cuttack',
        cities: [
          {
            name: 'Cuttack',
            pincode: '753001',
            lat: 20.4625,
            lng: 85.883,
            popularAreas: ['Badambadi', 'Buxi Bazaar', 'CDA Sector 6', 'Madhupatna'],
          },
        ],
      },
    ],
  },
  {
    code: 'PB',
    name: 'Punjab',
    type: 'state',
    capital: 'Chandigarh',
    districts: [
      {
        name: 'Ludhiana',
        cities: [
          {
            name: 'Ludhiana',
            pincode: '141001',
            lat: 30.901,
            lng: 75.8573,
            popularAreas: ['Model Town', 'Sarabha Nagar', 'BRS Nagar', 'Civil Lines', 'Ferozepur Road'],
          },
        ],
      },
      {
        name: 'Amritsar',
        cities: [
          {
            name: 'Amritsar',
            pincode: '143001',
            lat: 31.634,
            lng: 74.8723,
            popularAreas: ['Ranjit Avenue', 'Lawrence Road', 'Mall Road', 'Majitha Road'],
          },
        ],
      },
    ],
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    type: 'state',
    capital: 'Jaipur',
    districts: [
      {
        name: 'Jaipur',
        cities: [
          {
            name: 'Jaipur',
            pincode: '302001',
            lat: 26.9124,
            lng: 75.7873,
            popularAreas: ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'C-Scheme', 'Raja Park', 'Jagatpura'],
          },
        ],
      },
      {
        name: 'Jodhpur',
        cities: [
          {
            name: 'Jodhpur',
            pincode: '342001',
            lat: 26.2389,
            lng: 73.0243,
            popularAreas: ['Shastri Nagar', 'Ratanada', 'Sardarpura', 'Pal Road'],
          },
        ],
      },
      {
        name: 'Udaipur',
        cities: [
          {
            name: 'Udaipur',
            pincode: '313001',
            lat: 24.5854,
            lng: 73.7125,
            popularAreas: ['Fatehpura', 'Hiran Magri', 'Saheli Nagar', 'Shobhagpura'],
          },
        ],
      },
    ],
  },
  {
    code: 'SK',
    name: 'Sikkim',
    type: 'state',
    capital: 'Gangtok',
    districts: [
      {
        name: 'East Sikkim',
        cities: [
          {
            name: 'Gangtok',
            pincode: '737101',
            lat: 27.3389,
            lng: 88.6065,
            popularAreas: ['MG Marg', 'Tadong', 'Deorali', 'Development Area'],
          },
        ],
      },
    ],
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    type: 'state',
    capital: 'Chennai',
    districts: [
      {
        name: 'Chennai',
        cities: [
          {
            name: 'Chennai',
            pincode: '600001',
            lat: 13.0827,
            lng: 80.2707,
            popularAreas: ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'Besant Nagar', 'Mylapore', 'OMR (Thoraipakkam)', 'Nungambakkam', 'Porur'],
          },
        ],
      },
      {
        name: 'Coimbatore',
        cities: [
          {
            name: 'Coimbatore',
            pincode: '641001',
            lat: 11.0168,
            lng: 76.9558,
            popularAreas: ['RS Puram', 'Gandhipuram', 'Saibaba Colony', 'Peelamedu', 'Saravanampatti'],
          },
        ],
      },
      {
        name: 'Madurai',
        cities: [
          {
            name: 'Madurai',
            pincode: '625001',
            lat: 9.9252,
            lng: 78.1198,
            popularAreas: ['KK Nagar', 'Anna Nagar', 'Tallakulam', 'SS Colony'],
          },
        ],
      },
      {
        name: 'Tiruchirappalli',
        cities: [
          {
            name: 'Tiruchirappalli (Trichy)',
            pincode: '620001',
            lat: 10.7905,
            lng: 78.7047,
            popularAreas: ['Thillai Nagar', 'Cantonment', 'KK Nagar', 'Srirangam'],
          },
        ],
      },
    ],
  },
  {
    code: 'TS',
    name: 'Telangana',
    type: 'state',
    capital: 'Hyderabad',
    districts: [
      {
        name: 'Hyderabad & Rangareddy',
        cities: [
          {
            name: 'Hyderabad',
            pincode: '500001',
            lat: 17.385,
            lng: 78.4867,
            popularAreas: ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur (Hitech City)', 'Kondapur', 'Kukatpally', 'Secunderabad', 'Begumpet', 'Ameerpet'],
          },
        ],
      },
      {
        name: 'Warangal',
        cities: [
          {
            name: 'Warangal',
            pincode: '506001',
            lat: 17.9689,
            lng: 79.5941,
            popularAreas: ['Hanamkonda', 'Kazipet', 'Subedari', 'Nayeem Nagar'],
          },
        ],
      },
    ],
  },
  {
    code: 'TR',
    name: 'Tripura',
    type: 'state',
    capital: 'Agartala',
    districts: [
      {
        name: 'West Tripura',
        cities: [
          {
            name: 'Agartala',
            pincode: '799001',
            lat: 23.8315,
            lng: 91.2868,
            popularAreas: ['Banamalipur', 'Kunjaban', 'Radhanagar', 'Bhattanagar'],
          },
        ],
      },
    ],
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    type: 'state',
    capital: 'Lucknow',
    districts: [
      {
        name: 'Lucknow',
        cities: [
          {
            name: 'Lucknow',
            pincode: '226001',
            lat: 26.8467,
            lng: 80.9462,
            popularAreas: ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Mahanagar', 'Alambagh', 'Vikas Nagar'],
          },
        ],
      },
      {
        name: 'Gautam Buddha Nagar (Noida)',
        cities: [
          {
            name: 'Noida / Greater Noida',
            pincode: '201301',
            lat: 28.5355,
            lng: 77.391,
            popularAreas: ['Sector 18', 'Sector 62', 'Sector 50', 'Sector 137', 'Greater Noida West', 'Pari Chowk'],
          },
        ],
      },
      {
        name: 'Kanpur Nagar',
        cities: [
          {
            name: 'Kanpur',
            pincode: '208001',
            lat: 26.4499,
            lng: 80.3319,
            popularAreas: ['Swaroop Nagar', 'Kakadeo', 'Civil Lines', 'Kidwai Nagar', 'Lajpat Nagar'],
          },
        ],
      },
      {
        name: 'Varanasi',
        cities: [
          {
            name: 'Varanasi',
            pincode: '221001',
            lat: 25.3176,
            lng: 82.9739,
            popularAreas: ['Sigra', 'Lanka (BHU)', 'Mahmoorganj', 'Cantonment', 'Bhelupur'],
          },
        ],
      },
    ],
  },
  {
    code: 'UK',
    name: 'Uttarakhand',
    type: 'state',
    capital: 'Dehradun',
    districts: [
      {
        name: 'Dehradun',
        cities: [
          {
            name: 'Dehradun',
            pincode: '248001',
            lat: 30.3165,
            lng: 78.0322,
            popularAreas: ['Rajpur Road', 'Clement Town', 'Vasant Vihar', 'Dalanwala', 'Jakhan'],
          },
        ],
      },
      {
        name: 'Haridwar',
        cities: [
          {
            name: 'Haridwar',
            pincode: '249401',
            lat: 29.9457,
            lng: 78.1642,
            popularAreas: ['Ranipur', 'Jwalapur', 'Kankhal', 'Shivalik Nagar'],
          },
        ],
      },
    ],
  },
  {
    code: 'WB',
    name: 'West Bengal',
    type: 'state',
    capital: 'Kolkata',
    districts: [
      {
        name: 'Kolkata',
        cities: [
          {
            name: 'Kolkata',
            pincode: '700001',
            lat: 22.5726,
            lng: 88.3639,
            popularAreas: ['Salt Lake (Sector I-V)', 'New Town', 'Ballygunge', 'Alipore', 'Park Street', 'Gariahat', 'Dum Dum', 'Behala', 'Howrah'],
          },
        ],
      },
      {
        name: 'Darjeeling',
        cities: [
          {
            name: 'Siliguri',
            pincode: '734001',
            lat: 26.7271,
            lng: 88.3953,
            popularAreas: ['Sevoke Road', 'Pradhan Nagar', 'Matigara', 'Hakim Para'],
          },
        ],
      },
    ],
  },

  // 8 UNION TERRITORIES
  {
    code: 'DL',
    name: 'Delhi (NCT)',
    type: 'ut',
    capital: 'New Delhi',
    districts: [
      {
        name: 'South Delhi',
        cities: [
          {
            name: 'New Delhi',
            pincode: '110001',
            lat: 28.6139,
            lng: 77.209,
            popularAreas: [
              'Greater Kailash I & II',
              'Hauz Khas',
              'Saket',
              'Connaught Place',
              'Lajpat Nagar',
              'Vasant Kunj',
              'Dwarka Sector 1-23',
              'Rohini',
              'Janakpuri',
              'Kalkaji',
              'Malviya Nagar',
              'Defence Colony',
              'Karol Bagh',
              'Mayur Vihar',
            ],
          },
        ],
      },
    ],
  },
  {
    code: 'CH',
    name: 'Chandigarh',
    type: 'ut',
    capital: 'Chandigarh',
    districts: [
      {
        name: 'Chandigarh',
        cities: [
          {
            name: 'Chandigarh',
            pincode: '160017',
            lat: 30.7333,
            lng: 76.7794,
            popularAreas: ['Sector 17', 'Sector 35', 'Sector 8', 'Sector 22', 'Sector 43', 'Manimajra', 'IT Park'],
          },
        ],
      },
    ],
  },
  {
    code: 'JK',
    name: 'Jammu and Kashmir',
    type: 'ut',
    capital: 'Srinagar / Jammu',
    districts: [
      {
        name: 'Srinagar',
        cities: [
          {
            name: 'Srinagar',
            pincode: '190001',
            lat: 34.0837,
            lng: 74.7973,
            popularAreas: ['Lal Chowk', 'Rajbagh', 'Hyderpora', 'Karan Nagar', 'Dalgate'],
          },
        ],
      },
      {
        name: 'Jammu',
        cities: [
          {
            name: 'Jammu',
            pincode: '180001',
            lat: 32.7266,
            lng: 74.857,
            popularAreas: ['Gandhi Nagar', 'Channi Himmat', 'Trikuta Nagar', 'Bahu Plaza'],
          },
        ],
      },
    ],
  },
  {
    code: 'LA',
    name: 'Ladakh',
    type: 'ut',
    capital: 'Leh',
    districts: [
      {
        name: 'Leh',
        cities: [
          {
            name: 'Leh',
            pincode: '194101',
            lat: 34.1526,
            lng: 77.5771,
            popularAreas: ['Main Bazaar', 'Changspa', 'Choglamsar', 'Skara'],
          },
        ],
      },
    ],
  },
  {
    code: 'PY',
    name: 'Puducherry',
    type: 'ut',
    capital: 'Pondicherry',
    districts: [
      {
        name: 'Pondicherry',
        cities: [
          {
            name: 'Puducherry',
            pincode: '605001',
            lat: 11.9416,
            lng: 79.8083,
            popularAreas: ['White Town (French Quarter)', 'Muthialpet', 'Lawspet', 'Reddiarpalayam', 'Auroville Road'],
          },
        ],
      },
    ],
  },
  {
    code: 'AN',
    name: 'Andaman and Nicobar Islands',
    type: 'ut',
    capital: 'Port Blair',
    districts: [
      {
        name: 'South Andaman',
        cities: [
          {
            name: 'Port Blair',
            pincode: '744101',
            lat: 11.6234,
            lng: 92.7265,
            popularAreas: ['Aberdeen Bazaar', 'Garacharma', 'Junglighat', 'Dollygunj'],
          },
        ],
      },
    ],
  },
  {
    code: 'DH',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    type: 'ut',
    capital: 'Daman',
    districts: [
      {
        name: 'Daman',
        cities: [
          {
            name: 'Daman',
            pincode: '396210',
            lat: 20.3974,
            lng: 72.8328,
            popularAreas: ['Nani Daman', 'Moti Daman', 'Devka Beach Road'],
          },
        ],
      },
    ],
  },
  {
    code: 'LD',
    name: 'Lakshadweep',
    type: 'ut',
    capital: 'Kavaratti',
    districts: [
      {
        name: 'Lakshadweep',
        cities: [
          {
            name: 'Kavaratti',
            pincode: '682555',
            lat: 10.5669,
            lng: 72.642,
            popularAreas: ['Main Jetty Area', 'Secretariat Complex'],
          },
        ],
      },
    ],
  },
];

// Flat city list for quick global search
export const ALL_MAJOR_CITIES = ALL_INDIAN_STATES_AND_UTS.flatMap((state) =>
  state.districts.flatMap((d) =>
    d.cities.map((c) => ({
      cityName: c.name,
      stateName: state.name,
      stateCode: state.code,
      districtName: d.name,
      pincode: c.pincode,
      lat: c.lat,
      lng: c.lng,
      popularAreas: c.popularAreas,
    }))
  )
);
