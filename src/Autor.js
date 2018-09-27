import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioAutor extends Component{
    
    constructor(){
        super();//necessário para poder chamad os comando this abaixo
        this.state = {nome:'',email:'',senha:''};
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail =this.setEmail.bind(this);
        this.setSenha=this.setSenha.bind(this)
      }

    render(){
        return(
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned"  method="POST" onSubmit={this.enviaForm} >
                  <InputCustomizado id="nome" label="Nome"  type="text" name="nome" value={this.state.nome}  onChange={this.setNome}/>
                  <InputCustomizado id="email" label="Email"  type="email" name="email" value={this.state.email}  onChange={this.setEmail}/>
                  <InputCustomizado id="senha" label="Senha"  type="password" name="senha" value={this.state.senha}  onChange={this.setSenha}/>
                 
  
                  <div className="pure-control-group">                                  
                    <label></label> 
                    <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
                  </div>
                </form>             

            </div>
        );
    }

    enviaForm(evento){
        evento.preventDefault(); //Para evitar o reload da pagina o chamar este metodo
        $.ajax({
          url:"https://cdc-react.herokuapp.com/api/autores",
          contentType:'application/json',
          dataType: 'json',
          type:'post',
          data: JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
          success: function(novaLsitagem){
            PubSub.publish('atualiza-lista-autores',novaLsitagem);
            this.setState({nome:"",email:"",senha:""})
              //this.props.callbackAtualizaListagem(resposta);
          }.bind(this),  //.bind(this),  //necessario o bind para obter o this.serState
          error: function(resposta){
            if(resposta.status === 400){
              new TratadorErros().publicaErros(resposta.responseJSON);
            }
          },
          beforeSend: function(){
            PubSub.publish("limpa-erros",{});
          }
        });
    }

    setNome(evento){
       this.setState({nome:evento.target.value});
    }
    
    setEmail(evento){
       this.setState({email:evento.target.value});
    }
    
    setSenha(evento){
       this.setState({senha:evento.target.value});
    }

}


class TabelaAutores extends Component{

   
    render(){
        return(
            <div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.lista.map(function(autor){
                          return (
                            <tr key={autor.id}>
                              <td>{autor.nome}</td>
                              <td>{autor.email}</td>
                            </tr>
                          );

                    })
                    }                   
                  </tbody>
                </table> 
              </div>             
        );

    }
    
}


export default class AutorBox extends Component {
    constructor(){
        super();
        this.state = {lista : []};
        //this.atulizaListagem = this.atulizaListagem.bind(this);
    }

    componentDidMount() //Metodo do ciclo de vida do Recat chamado antes do contructor
    {
      $.ajax({
        url:"https://cdc-react.herokuapp.com/api/autores",
        dataType: 'json',
        success:function(resposta){    
          this.setState({lista:resposta});
        }.bind(this)
      } 
    );          
    PubSub.subscribe('atualiza-lista-autores', function(topico,novaLista){
       this.setState({lista:novaLista});
    }.bind(this));

    }

    //atulizaListagem(novaLista){
    // this.setState({lista:novaLista});
    //}

    render(){
        return(
          <div id="main">
          <div className="header">
            <h1>Cadastro de Autores</h1>
          </div>
          <div className="content" id="content">
             <FormularioAutor callbackAtualizaListagem={this.atulizaListagem}/>
             <TabelaAutores lista={this.state.lista}/>
          </div>
        </div>          
       
       
        );
    }
}