import React from "react";
import { Card, CardContent, CardHeader } from "@material-ui/core/";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core/";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Fab from '@material-ui/core/Fab';
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import {sortBy} from "lodash";


import AddToQueueIcon from '@material-ui/icons/AddToQueue';
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonIcon from "@material-ui/icons/Person";
import HackImg from "../assests/hack.PNG"
import { request } from "https";

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formTouched: false,
      dialogOpen: false,
      dialogType: '',
      dialogMessage: '',
      newItem: "",
      skillOptions: ["nodeJs", "React", "Ng", "C#", "Java", "Oracle", "SQL Server"],
      firstName: "",
      lastName: "",
      email: "",
      teamName: "",
      teamMembers: [],
      ideaTitle: "",
      ideaDescription: "",
      skills: []
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
  }

  formIsValid() {
    if (this.state.firstName.length === 0 || this.state.lastName.length === 0 || !this.emailIsValid(this.state.email))
      return false
    else
      return true
  }

  emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  handleTextChange = name => event => {
    this.setState({ formTouched: true })
    this.setState({ [name]: event.target.value });
  };

  handleDeleteMember = (name) => {
    this.setState({ teamMembers: this.state.teamMembers.filter(e => e !== name.member) });
  }

  handleDialogClickOpen = (actionType) => {
    this.setState({ dialogType: actionType })
    this.setState({ dialogOpen: true });
  };

  handleDialogAddItem = () => {
    if (this.state.dialogType === "Skill") {
      if (typeof this.state.skills.find(x => x === this.state.newItem) === 'undefined') {
        var newSkills = this.state.skills;
        newSkills.push(this.state.newItem);
        this.setState({ skills: newSkills });
      } else {
        this.setState({dialogMessage: "Skill entered is a duplicate."})
      };

      if (typeof this.state.skillOptions.find(x => x === this.state.newItem) === 'undefined') {
        var newOptions = this.state.skillOptions;
        newOptions.push(this.state.newItem);
        this.setState({ skillOptions: newOptions });
      };
    } else {
      if (typeof this.state.teamMembers.find(x => x === this.state.newItem) === 'undefined') {
        var newMember = this.state.teamMembers;
        newMember.push(this.state.newItem);
        this.setState({ teamMembers: newMember });
      } else {
        this.setState({dialogMessage: "Teammate entered is a duplicate."})
      };
    }

    this.setState({ newItem: "" });
  }

  handleDialogClose = () => {
    this.setState({ newItem: "" });
    this.setState({ dialogOpen: false });
  };

  handleContinue = () => {
    let userData = {
      "user": {
        "firstName": this.state.firstName,
        "lastName": this.state.lastName,
        "email": this.state.email,
        "skills": this.state.skills
      },
      "team": {
        "name": this.state.teamName,
        "members": this.state.teamMembers
      },
      "idea": {
        "title": this.state.ideaTitle,
        "description": this.state.ideaDescription
      }
    };

    fetch("http://40.121.12.189:8080/api/registrations/", {
      mode: 'no-cors',
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(response => {
      response.json().then(data => {
        console.log("Successful" + data);
      });
    }).catch(function(error){
      console.log('Request Failed', error)
    });

    console.log(userData);
    debugger;

    this.props.history.push(`/Baseline`)
  }

  render() {
    return (
      <div>
        <Grid container justify="center">
          <Grid item md={5}>
            <Card>
              <CardHeader title="HACKATHON" />
              <CardContent>
                <Grid container spacing={16} alignItems="stretch">
                  <Grid item lg={5} style={{ backgroundColor: 'dark' }}>
                    <Typography variant="h3" color="secondary">Register Now..</Typography>
                    <Hidden mdDown>
                      <img src={HackImg} alt="Hack Class" style={{ height: "200px", width: "200px", borderRadius: "50%", marginTop: "25px", marginBottom: "25px", opacity: "0.3" }} />
                    </Hidden>
                    <Typography variant="h5" color="secondary">and let the hacking begin!</Typography>
                  </Grid>
                  <Grid item lg={7}>
                    <Grid container>
                      <Grid item xs={12}>
                        <TextField id="firstName" label="First Name"
                          value={this.state.firstName} inputProps={{maxLength: 15}}
                          onChange={this.handleTextChange("firstName")}
                          margin="normal" variant="outlined" fullWidth 
                          helperText={this.state.formTouched && this.state.firstName.length === 0 ? 'Required' : ''}
                          error={this.state.formTouched && this.state.firstName.length === 0 ? true : false}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField id="lastName" label="Last Name"
                          value={this.state.lastName} inputProps={{maxLength: 20}}
                          onChange={this.handleTextChange("lastName")}
                          margin="normal" variant="outlined" fullWidth
                          helperText={this.state.formTouched && this.state.lastName.length === 0 ? 'Required' : ''}
                          error={this.state.formTouched && this.state.lastName.length === 0 ? true : false}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField id="email" label="Email"
                          value={this.state.email} inputProps={{maxLength: 50}}
                          onChange={this.handleTextChange("email")}
                          margin="normal" variant="outlined" fullWidth
                          helperText={this.state.formTouched && !this.emailIsValid(this.state.email) ? 'Valid Email Required' : ''}
                          error={this.state.formTouched && !this.emailIsValid(this.state.email) ? true : false}
                        />
                      </Grid>
                      <Grid item xs={10}>
                        <TextField id="teamName" label="Team Name"
                          value={this.state.teamName} inputProps={{maxLength: 35}}
                          onChange={this.handleTextChange("teamName")}
                          margin="normal" variant="outlined" fullWidth
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip title="Add your teammate">
                          <Fab color="primary" size="small" style={{ marginTop: '22px' }} disabled={(!this.state.teamName.length)}
                            onClick={() => this.handleDialogClickOpen('Teammate')}>
                            <PersonAddIcon />
                          </Fab>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={2}>
                        <div>
                          {this.state.teamMembers.map(member =>
                            <Chip name={member} label={member} onDelete={() => this.handleDeleteMember({ member })} color={"secondary"} style={{ marginBottom: '3px', marginRight: '3px' }}
                              avatar={<Avatar> <PersonIcon /> </Avatar>} />
                          )}
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField id="ideaTitle" label="Idea"
                          value={this.state.ideaTitle} inputProps={{maxLength: 100}}
                          onChange={this.handleTextChange("ideaTitle")}
                          margin="normal" variant="outlined" fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField id="ideaDescription" label="Idea Description"
                          value={this.state.ideaDescription} inputProps={{maxLength: 200}}
                          onChange={this.handleTextChange("ideaDescription")}
                          margin="normal" variant="outlined" fullWidth
                        />
                      </Grid>
                      <Grid item xs={10}>
                        <FormControl fullWidth variant="outlined" style={{ marginTop: '15px' }}>
                          <InputLabel shrink htmlFor="skillSelect">Skills</InputLabel>
                          <Select
                            multiple
                            value={this.state.skills}
                            onChange={this.handleTextChange("skills")}
                            input={<OutlinedInput id="skillSelect" />}
                            renderValue={selected => (
                              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {selected.map(value => (
                                  <Chip key={value} label={value} color={"secondary"} style={{ marginTop: '3px', marginRight: '3px' }} />
                                ))}
                              </div>
                            )}
                            fullWidth
                          >
                            { sortBy(this.state.skillOptions).map(skills => (
                              <MenuItem key={skills} value={skills}>
                                {skills}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip title="Add a skill">
                          <Fab color="primary" aria-label="Add" size="small" style={{ marginTop: '22px' }} onClick={() => this.handleDialogClickOpen('Skill')} disabled={!this.state.formTouched}>
                            <AddToQueueIcon />
                          </Fab>
                        </Tooltip>
                      </Grid>
                    </Grid>
                    <br />
                    <Button onClick={this.handleContinue} variant="outlined" color="primary" disabled={!this.formIsValid()}>
                      Continue
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
          <DialogTitle>
            Enter additional {this.state.dialogType} 
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography>{this.state.dialogMessage}</Typography>
              <TextField id="newItem" label={this.state.dialogType} 
                value={this.state.newItem} inputProps={{maxLength: 35}}
                onChange={this.handleTextChange("newItem")}
                margin="normal" variant="outlined" fullWidth />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleDialogAddItem()} color="primary" disabled={(this.state.newItem==="")} autoFocus>
              Add
            </Button>
            <Button onClick={this.handleDialogClose} color="disabled">
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default Register;