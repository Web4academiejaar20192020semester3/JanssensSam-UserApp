import { Component, Input, OnInit } from '@angular/core';
import { User} from '../user';
import { UserService} from '../user.service';
import { ActivatedRoute} from '@angular/router';
import { Location} from '@angular/common';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @Input()user: User;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    this.userService.getUser(userId)
      .subscribe(user => this.user = user);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.userService.updateUser(this.user)
      /*.subscribe(() => this.goBack())*/;
  }
}
