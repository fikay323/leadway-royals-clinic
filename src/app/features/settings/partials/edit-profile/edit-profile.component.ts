import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { InformationForm, ProfileService } from '../../../../shared/services/profile.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  loading = false
  user$: Observable<User> = this.authService.user$
  personalInformation: InformationForm
  personalInformation$: Observable<InformationForm> = this.profileService.getPersonalInformation(this.authService.user$)
  personalInformationForm = this.formBuilder.group({
    'personalInformation': this.formBuilder.group({
      'fullName': ['', Validators.required],
      'dateOfBirth': ['', Validators.required],
      'gender': ['', Validators.required],
      'age': ['', Validators.required],
      'address': ['', Validators.required],
      'phoneNumber': ['', Validators.required]
    }),
    'medicalHistory': this.formBuilder.group({
      'pastMedicalConditions': this.formBuilder.array<string>([]),
      'currentMedications': this.formBuilder.array<string>([]),
      'allergies': this.formBuilder.array<string>([])
    }),
    'vitalSigns': this.formBuilder.group({
      'bloodPressure': ['', Validators.required],
      'temperature': ['', Validators.required],
      'heartRate': ['', Validators.required],
      'weight': ['', Validators.required]
    })
  });

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.personalInformation$.subscribe(info => {
      this.personalInformation = info
      this.updateFormWithValues()
    })

  }
  
  updateFormWithValues() {
    this.personalInformationForm.patchValue({
      personalInformation: {
        'fullName': this.personalInformation.personalInformation.fullName,
        'dateOfBirth': this.personalInformation.personalInformation.dateOfBirth,
        'gender': this.personalInformation.personalInformation.gender,
        'age': this.personalInformation.personalInformation.age,
        'address': this.personalInformation.personalInformation.address,
        'phoneNumber': this.personalInformation.personalInformation.phoneNumber
      },
      vitalSigns: {
        bloodPressure: this.personalInformation.vitalSigns.bloodPressure,
        temperature: this.personalInformation.vitalSigns.temperature,
        heartRate: this.personalInformation.vitalSigns.heartRate,
        weight: this.personalInformation.vitalSigns.weight
      }
    })
  
    const pastMedicalConditionsArray = this.personalInformationForm.get('medicalHistory.pastMedicalConditions') as FormArray;
    this.personalInformation.medicalHistory.pastMedicalConditions.forEach(condition => {
      pastMedicalConditionsArray.push(this.formBuilder.control(condition));
    });
  
    const currentMedicationsArray = this.personalInformationForm.get('medicalHistory.currentMedications') as FormArray;
    this.personalInformation.medicalHistory.currentMedications.forEach(medication => {
      currentMedicationsArray.push(this.formBuilder.control(medication));
    });
  
    const allergiesArray = this.personalInformationForm.get('medicalHistory.allergies') as FormArray;
    this.personalInformation.medicalHistory.allergies.forEach(allergy => {
      allergiesArray.push(this.formBuilder.control(allergy));
    });
  }

  private formatDate(date: Date): string {
    console.log('Formatting date')
    const newDate = new Date(date)
    console.log(newDate)
    const year = newDate.getFullYear();
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = newDate.getDate().toString().padStart(2, '0');
    console.log(`${year}-${month}-${day}`)
    return `${year}-${month}-${day}`; // Return formatted date string
  }


  get pastMedicalConditions() {
    return this.personalInformationForm.get('medicalHistory.pastMedicalConditions') as FormArray;
  }
  
  get currentMedications() {
    return this.personalInformationForm.get('medicalHistory.currentMedications') as FormArray;
  }

  get allergies() {
    return this.personalInformationForm.get('medicalHistory.allergies') as FormArray;
  }

  addPastMedicalCondition() {
    this.pastMedicalConditions.push(this.formBuilder.control('', Validators.required));
  }

  removePastMedicalCondition(index) {
    this.pastMedicalConditions.removeAt(index);
  }

  addCurrentMedication() {
    this.currentMedications.push(this.formBuilder.control('', Validators.required));
  }
  removeCurrentMedication(index) {
    this.currentMedications.removeAt(index)
  }

  addAllergy() {
    this.allergies.push(this.formBuilder.control('', Validators.required));
  }

  removeAllergy(index) {
    this.allergies.removeAt(index);
  }

  onSubmit() {
    this.loading = true
    if (this.personalInformationForm.invalid)  return
    const { personalInformation, medicalHistory, vitalSigns } = this.personalInformationForm.value;
    const formData: InformationForm  = {
      personalInformation: {
        fullName: personalInformation.fullName,
        dateOfBirth: personalInformation.dateOfBirth,
        gender: personalInformation.gender,
        age: personalInformation.age,
        address: personalInformation.address,
        phoneNumber: personalInformation.phoneNumber,
      },
      medicalHistory: {
        pastMedicalConditions: medicalHistory.pastMedicalConditions,
        currentMedications: medicalHistory.currentMedications,
        allergies: medicalHistory.allergies,
      },
      vitalSigns: {
        bloodPressure: vitalSigns.bloodPressure,
        temperature: vitalSigns.temperature,
        heartRate: vitalSigns.heartRate,
        weight: vitalSigns.weight,
      },
    };
    this.profileService.updateUserPersonalInformation(formData, this.user$).subscribe(res => {
      this.loading = false
      setTimeout(() => {
        this.router.navigate(['/main-app', 'settings'])
      }, 500);
    })
  }
}
