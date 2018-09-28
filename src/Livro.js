import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import SelectCustomizado from './componentes/SelectCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component{
    
    constructor(){
        super();//necessário para poder chamad os comando this abaixo
        this.state = {titulo:'',preco:'',autorId:''};      
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco =this.setPreco.bind(this);
        this.setAutorId=this.setAutorId.bind(this)
      }

    render(){
        return(
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned"  method="POST" onSubmit={this.enviaForm} >
                  <InputCustomizado id="titulo" label="Título"  type="text" name="titulo" value={this.state.titulo}  onChange={this.setTitulo}/>
                  <InputCustomizado id="preco" label="Preço"  type="text" name="preco" value={this.state.preco}  onChange={this.setPreco}/>
                  <SelectCustomizado id="autorId" label="Autor" autorId={this.state.autorId} onChange={this.setAutorId} listaAutores={this.props.listaAutores}/>
                                  
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
          url:"https://cdc-react.herokuapp.com/api/livros",
          contentType:'application/json',
          dataType: 'json',
          type:'post',
          data: JSON.stringify({titulo:this.state.titulo,preco:this.state.preco,autorId:this.state.autorId}),
          success: function(novaLsitagem){
            PubSub.publish('atualiza-lista-livros',novaLsitagem);
            this.setState({titulo:"",preco:"",autorId:""})
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

    setTitulo(evento){
       this.setState({titulo:evento.target.value});
    }
    
    setPreco(evento){
       this.setState({preco:evento.target.value});
    }
    
    setAutorId(evento){
       this.setState({autorId:evento.target.value});
    }

}


class TabelaLivros extends Component{
   
    render(){
        return(
            <div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Autor</th>
                      <th>Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.listaLivros.map(function(livro){
                          return (
                            <tr key={livro.id}>
                              <td>{livro.titulo}</td>
                              <td>{livro.autor.nome}</td>
                              <td>{livro.preco}</td>
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


export default class LivroBox extends Component {
    constructor(){
        super();
        this.state = {listaLivros : [],listaAutores : [] };
        //this.atulizaListagem = this.atulizaListagem.bind(this);
    }

    componentDidMount() //Metodo do ciclo de vida do Recat chamado antes do contructor
    {
      $.ajax({
        url:"https://cdc-react.herokuapp.com/api/livros",
        dataType: 'json',
        success:function(resposta){    
          this.setState({listaLivros:resposta});
        }.bind(this)
      } );
      
      $.ajax({
        url:"https://cdc-react.herokuapp.com/api/autores",
        dataType: 'json',
        success:function(resposta){    
          this.setState({listaAutores:resposta});
        }.bind(this)
      });
   
                 
    PubSub.subscribe('atualiza-lista-livros', function(topico,novaLista){
       this.setState({listaLivros:novaLista});
    }.bind(this));

    }

    //atulizaListagem(novaLista){
    // this.setState({lista:novaLista});
    //}

    render(){
        return(
          <div id="main">
          <div className="header">
            <h1>Cadastro de Livros</h1>
          </div>
          <div className="content" id="content">
             <FormularioLivro  listaAutores={this.state.listaAutores}/>
             <TabelaLivros listaLivros={this.state.listaLivros}/>
          </div>
        </div>          
       
       
        );
    }
}