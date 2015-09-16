void setup()
{
  Serial.begin(57600);
  for (int i = 2; i < 13; i++ )  pinMode(i, OUTPUT);
}


//variables for serial readin
int incomingByte = 0;
int control = 0;
int reads[10];
int counter = 0;


void loop()
{
  if (Serial.available() > 1)
  {
    for (int i = 2; i < 13; i++ ) digitalWrite(i, LOW);
    delay(50);

    while (Serial.available() > 0)
    {
      incomingByte = Serial.read();

      //if incomingByte is a number, treat like a number
      if (incomingByte >= 48 && incomingByte < 59)
      {
        reads[counter] = incomingByte - 48; //yay ascii -> char(i)-48 = i
      }
      else reads[counter] = incomingByte;
      counter++;
    }

    int pinner = 10 * reads[0] + reads[1];
    digitalWrite(pinner, HIGH);
    digitalWrite(pinner+5, HIGH);
    Serial.println(pinner);
  }

  counter = 0;

}
