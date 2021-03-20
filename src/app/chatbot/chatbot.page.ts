import { Component, OnInit } from '@angular/core';
import { LexRuntime } from 'aws-sdk';
import { Message } from './messages';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
})
export class ChatbotPage implements OnInit {
  lex: LexRuntime;
  userInput: string = '';
  messages: Message[] = [];
  lexState: string = 'OK, what\'s up?';

  constructor() {}

  ngOnInit() {
    this.messages.push(new Message(this.lexState, 'Bam!'));
  }

  postLexText() {
    let params = {
      botAlias: '$LATEST',
      botName: 'freelancer',
      inputText: 'testing',
      userId: 'User',
    };
    this.lex = new LexRuntime({
      accessKeyId: environment.AWSAPIKEY,
      secretAccessKey: environment.AWSSECRETKEY,
      region: 'us-east-1',
    });

    params.inputText = this.userInput;

    this.lex.postText(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
        this.lexState = data.message;
      }
      this.messages.push(new Message(this.userInput, 'Paul'));
      this.messages.push(new Message(this.lexState, 'Bam!'));

      this.userInput = null;   // if you don't clear userInput, the old value stays in the input box.
    });
  }
}
